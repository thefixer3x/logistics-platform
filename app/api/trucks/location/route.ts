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
    const truckId = searchParams.get('truckId')

    let query = supabase
      .from('truck_locations')
      .select(`
        *,
        trucks (
          plate_number,
          status,
          driver_id,
          profiles:driver_id (
            first_name,
            last_name
          )
        )
      `)
      .order('recorded_at', { ascending: false })

    if (truckId) {
      query = query.eq('truck_id', truckId)
    }

    const { data: locations, error } = await query.limit(100)

    if (error) {
      console.error('Error fetching truck locations:', error)
      return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 })
    }

    return NextResponse.json({ locations })

  } catch (error) {
    console.error('Error in truck location API:', error)
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
    const { truck_id, latitude, longitude, speed, heading, accuracy, battery_level } = body

    // Validate required fields
    if (!truck_id || !latitude || !longitude) {
      return NextResponse.json({ 
        error: 'Missing required fields: truck_id, latitude, longitude' 
      }, { status: 400 })
    }

    // Check if user has permission to update this truck's location
    const { data: truck } = await supabase
      .from('trucks')
      .select('driver_id')
      .eq('id', truck_id)
      .single()

    if (!truck) {
      return NextResponse.json({ error: 'Truck not found' }, { status: 404 })
    }

    // For drivers, only allow updating their own truck
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile?.role === 'driver' && truck.driver_id !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized to update this truck' }, { status: 403 })
    }

    // Insert location record
    const { data: location, error } = await supabase
      .from('truck_locations')
      .insert({
        truck_id,
        latitude,
        longitude,
        speed: speed || null,
        heading: heading || null,
        accuracy: accuracy || null,
        battery_level: battery_level || null,
        recorded_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error inserting truck location:', error)
      return NextResponse.json({ error: 'Failed to record location' }, { status: 500 })
    }

    // Update truck's current location
    await supabase
      .from('trucks')
      .update({
        current_latitude: latitude,
        current_longitude: longitude,
        last_location_update: new Date().toISOString()
      })
      .eq('id', truck_id)

    // Send real-time update via Supabase channels
    await supabase
      .channel('truck_tracking')
      .send({
        type: 'broadcast',
        event: 'location_update',
        payload: {
          truck_id,
          latitude,
          longitude,
          speed,
          heading,
          timestamp: location.recorded_at
        }
      })

    return NextResponse.json({ 
      success: true, 
      location_id: location.id 
    })

  } catch (error) {
    console.error('Error in truck location POST:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Bulk location update for multiple trucks
export async function PUT(request: NextRequest) {
  try {
    const supabase = createRouteHandlerClient({ cookies })
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { locations } = body

    if (!Array.isArray(locations) || locations.length === 0) {
      return NextResponse.json({ 
        error: 'Invalid locations array' 
      }, { status: 400 })
    }

    // Validate each location
    for (const loc of locations) {
      if (!loc.truck_id || !loc.latitude || !loc.longitude) {
        return NextResponse.json({ 
          error: 'Each location must have truck_id, latitude, and longitude' 
        }, { status: 400 })
      }
    }

    // Check user permissions (only supervisors and admins can bulk update)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['supervisor', 'admin'].includes(profile.role)) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    // Prepare location records
    const locationRecords = locations.map(loc => ({
      truck_id: loc.truck_id,
      latitude: loc.latitude,
      longitude: loc.longitude,
      speed: loc.speed || null,
      heading: loc.heading || null,
      accuracy: loc.accuracy || null,
      battery_level: loc.battery_level || null,
      recorded_at: loc.timestamp || new Date().toISOString()
    }))

    // Bulk insert locations
    const { data: insertedLocations, error: insertError } = await supabase
      .from('truck_locations')
      .insert(locationRecords)
      .select()

    if (insertError) {
      console.error('Error bulk inserting locations:', insertError)
      return NextResponse.json({ error: 'Failed to record locations' }, { status: 500 })
    }

    // Update current locations for each truck
    const truckUpdates = locations.map(loc => 
      supabase
        .from('trucks')
        .update({
          current_latitude: loc.latitude,
          current_longitude: loc.longitude,
          last_location_update: loc.timestamp || new Date().toISOString()
        })
        .eq('id', loc.truck_id)
    )

    await Promise.all(truckUpdates)

    // Send real-time updates
    for (const loc of locations) {
      await supabase
        .channel('truck_tracking')
        .send({
          type: 'broadcast',
          event: 'location_update',
          payload: {
            truck_id: loc.truck_id,
            latitude: loc.latitude,
            longitude: loc.longitude,
            speed: loc.speed,
            heading: loc.heading,
            timestamp: loc.timestamp || new Date().toISOString()
          }
        })
    }

    return NextResponse.json({ 
      success: true, 
      updated_count: insertedLocations.length 
    })

  } catch (error) {
    console.error('Error in bulk location update:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
