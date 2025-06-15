'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Loader, MapPin, Navigation } from 'lucide-react'

interface LiveMapProps {
  driverId: string
}

export function LiveMap({ driverId }: LiveMapProps) {
  const [loading, setLoading] = useState(true)
  const [location, setLocation] = useState<any>(null)
  const [destination, setDestination] = useState<any>(null)

  useEffect(() => {
    // In a real implementation, this would use a mapping service like Google Maps or Mapbox
    // For the demo, we'll simulate a map with driver location data from the database
    
    async function fetchLocationData() {
      if (!driverId) return
      
      try {
        // Get current trip info
        const { data: tripData, error: tripError } = await supabase
          .from('trips')
          .select('*, destination_coordinates')
          .eq('driver_id', driverId)
          .eq('status', 'in_progress')
          .single()
          
        if (tripError && tripError.code !== 'PGRST116') {
          console.error('Error fetching trip data:', tripError)
          return
        }
        
        // Get driver's current location
        const { data: locationData, error: locationError } = await supabase
          .from('driver_locations')
          .select('*')
          .eq('driver_id', driverId)
          .single()
          
        if (locationError && locationError.code !== 'PGRST116') {
          console.error('Error fetching location data:', locationError)
          return
        }
        
        setLocation(locationData || { 
          latitude: 9.0820, 
          longitude: 8.6753, // Default to Nigeria's center coordinates
          last_updated: new Date().toISOString() 
        })
        
        setDestination(tripData?.destination_coordinates || null)
      } catch (error) {
        console.error('Failed to fetch map data:', error)
      } finally {
        setLoading(false)
      }
    }
    
    fetchLocationData()
    
    // Set up real-time subscription for location updates
    const channel = supabase
      .channel('driver_location_changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'driver_locations',
          filter: `driver_id=eq.${driverId}`
        },
        (payload) => {
          setLocation(payload.new)
        }
      )
      .subscribe()
      
    return () => {
      supabase.removeChannel(channel)
    }
  }, [driverId])
  
  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center">
          <Loader className="h-8 w-8 animate-spin text-logistics-500" />
          <p className="mt-3 text-gray-600">Loading map data...</p>
        </div>
      </div>
    )
  }
  
  return (
    <div className="relative h-full bg-blue-50">
      {/* This would be replaced with an actual map component in production */}
      <div className="absolute inset-0 bg-blue-50 flex flex-col items-center justify-center">
        <div className="text-center mb-6">
          <p className="text-sm text-gray-500 mb-1">This is a placeholder for the map component</p>
          <p className="text-sm text-gray-500">In production, this would integrate with Google Maps or Mapbox</p>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-md">
          <div className="font-medium mb-2">Current Location Data</div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Current Position</span>
              </div>
              <div className="font-mono mt-1">
                {location?.latitude.toFixed(4)}, {location?.longitude.toFixed(4)}
              </div>
            </div>
            
            <div>
              <div className="flex items-center text-gray-600">
                <Navigation className="h-4 w-4 mr-1" />
                <span>Last Updated</span>
              </div>
              <div className="font-mono mt-1">
                {new Date(location?.last_updated).toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          {destination && (
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1 text-red-500" />
                <span>Destination</span>
              </div>
              <div className="font-mono">
                {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
