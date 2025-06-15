import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

export async function GET(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const driverId = searchParams.get('driverId')
    const truckId = searchParams.get('truckId')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('trips')
      .select(`
        *,
        trucks (
          plate_number,
          status
        ),
        driver:profiles!trips_driver_id_fkey (
          first_name,
          last_name,
          phone
        ),
        customer:profiles!trips_customer_id_fkey (
          first_name,
          last_name,
          company_name,
          phone
        )
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    // Apply filters
    if (status) {
      query = query.eq('status', status)
    }
    if (driverId) {
      query = query.eq('driver_id', driverId)
    }
    if (truckId) {
      query = query.eq('truck_id', truckId)
    }

    // Role-based filtering
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role === 'driver') {
      query = query.eq('driver_id', session.user.id)
    }

    const { data: trips, error } = await query

    if (error) {
      console.error('Error fetching trips:', error)
      return NextResponse.json({ error: 'Failed to fetch trips' }, { status: 500 })
    }

    return NextResponse.json({ trips })

  } catch (error) {
    console.error('Error in trips API:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const {
      truck_id,
      driver_id,
      customer_id,
      origin,
      destination,
      scheduled_pickup,
      scheduled_delivery,
      cargo_type,
      cargo_weight,
      cargo_value,
      special_instructions,
      priority = 'medium'
    } = body

    // Validate required fields
    if (!truck_id || !driver_id || !customer_id || !origin || !destination) {
      return NextResponse.json({
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Check permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['supervisor', 'admin', 'contractor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Verify truck and driver exist and are available
    const { data: truck } = await supabase
      .from('trucks')
      .select('status')
      .eq('id', truck_id)
      .single()

    if (!truck || truck.status !== 'available') {
      return NextResponse.json({ error: 'Truck not available' }, { status: 400 })
    }

    const { data: driver } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', driver_id)
      .eq('role', 'driver')
      .single()

    if (!driver) {
      return NextResponse.json({ error: 'Driver not found' }, { status: 404 })
    }

    // Calculate estimated values
    const estimatedDistance = calculateDistance(origin, destination)
    const estimatedDuration = Math.round(estimatedDistance * 1.5) // hours
    const estimatedCost = calculateTripCost(estimatedDistance, cargo_weight, priority)

    // Create the trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        truck_id,
        driver_id,
        customer_id,
        origin,
        destination,
        scheduled_pickup,
        scheduled_delivery,
        cargo_type,
        cargo_weight,
        cargo_value,
        special_instructions,
        priority,
        estimated_distance: estimatedDistance,
        estimated_duration: estimatedDuration,
        estimated_cost: estimatedCost,
        status: 'scheduled',
        created_by: session.user.id
      })
      .select()
      .single()

    if (tripError) {
      console.error('Error creating trip:', tripError)
      return NextResponse.json({ error: 'Failed to create trip' }, { status: 500 })
    }

    // Update truck status
    await supabase
      .from('trucks')
      .update({ status: 'assigned' })
      .eq('id', truck_id)

    // Create notification for driver
    await supabase
      .from('notifications')
      .insert({
        user_id: driver_id,
        title: 'New Trip Assigned',
        message: `You have been assigned a new trip from ${origin} to ${destination}`,
        type: 'trip_assigned',
        data: { trip_id: trip.id }
      })

    // Send real-time notification
    await supabase
      .channel('trip_updates')
      .send({
        type: 'broadcast',
        event: 'trip_created',
        payload: {
          trip_id: trip.id,
          driver_id,
          truck_id,
          status: 'scheduled'
        }
      })

    return NextResponse.json({ 
      success: true, 
      trip_id: trip.id,
      trip 
    })

  } catch (error) {
    console.error('Error creating trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { trip_id, ...updates } = body

    if (!trip_id) {
      return NextResponse.json({ error: 'Trip ID required' }, { status: 400 })
    }

    // Get existing trip
    const { data: existingTrip } = await supabase
      .from('trips')
      .select('*')
      .eq('id', trip_id)
      .single()

    if (!existingTrip) {
      return NextResponse.json({ error: 'Trip not found' }, { status: 404 })
    }

    // Check permissions
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    // Drivers can only update their own trips
    if (profile?.role === 'driver' && existingTrip.driver_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    }

    // Handle status updates
    if (updates.status) {
      updates.updated_at = new Date().toISOString()
      
      // Set timestamps based on status
      switch (updates.status) {
        case 'in_progress':
          updates.actual_pickup = new Date().toISOString()
          break
        case 'completed':
          updates.actual_delivery = new Date().toISOString()
          updates.completed_at = new Date().toISOString()
          break
        case 'cancelled':
          updates.cancelled_at = new Date().toISOString()
          break
      }
    }

    // Update the trip
    const { data: updatedTrip, error: updateError } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', trip_id)
      .select()
      .single()

    if (updateError) {
      console.error('Error updating trip:', updateError)
      return NextResponse.json({ error: 'Failed to update trip' }, { status: 500 })
    }

    // Handle truck status updates
    if (updates.status === 'completed' || updates.status === 'cancelled') {
      await supabase
        .from('trucks')
        .update({ status: 'available' })
        .eq('id', existingTrip.truck_id)
    }

    // Create status update notification
    if (updates.status) {
      const statusMessages = {
        in_progress: 'Trip has started',
        completed: 'Trip completed successfully',
        cancelled: 'Trip has been cancelled',
        delayed: 'Trip is delayed'
      }

      const message = statusMessages[updates.status] || `Trip status updated to ${updates.status}`

      // Notify relevant parties
      const notificationRecipients = [existingTrip.customer_id]
      if (profile?.role !== 'driver') {
        notificationRecipients.push(existingTrip.driver_id)
      }

      for (const recipientId of notificationRecipients) {
        await supabase
          .from('notifications')
          .insert({
            user_id: recipientId,
            title: 'Trip Status Update',
            message,
            type: 'trip_update',
            data: { trip_id, status: updates.status }
          })
      }
    }

    // Send real-time update
    await supabase
      .channel('trip_updates')
      .send({
        type: 'broadcast',
        event: 'trip_updated',
        payload: {
          trip_id,
          ...updates
        }
      })

    return NextResponse.json({ 
      success: true, 
      trip: updatedTrip 
    })

  } catch (error) {
    console.error('Error updating trip:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Helper functions
function calculateDistance(origin: string, destination: string): number {
  // In a real implementation, use a mapping service like Google Maps API
  // For now, return a mock distance based on string length (placeholder)
  return Math.round(Math.random() * 500 + 50) // 50-550 km
}

function calculateTripCost(distance: number, weight: number, priority: string): number {
  const baseRate = 150 // ₦150 per km
  const weightMultiplier = weight ? Math.max(1, weight / 1000) : 1
  const priorityMultiplier = priority === 'high' ? 1.5 : priority === 'low' ? 0.8 : 1
  
  return Math.round(distance * baseRate * weightMultiplier * priorityMultiplier)
}
