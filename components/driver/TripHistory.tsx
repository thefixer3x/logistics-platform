'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Clock, Truck, MapPin, Package } from 'lucide-react'

interface TripHistoryProps {
  driverId: string
}

export function TripHistory({ driverId }: TripHistoryProps) {
  const [trips, setTrips] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchTrips() {
      if (!driverId) return

      try {
        const { data, error } = await supabase
          .from('trips')
          .select('*')
          .eq('driver_id', driverId)
          .order('start_date', { ascending: false })
          .limit(10)

        if (error) {
          console.error('Error fetching trips:', error)
          return
        }

        setTrips(data || [])
      } catch (error) {
        console.error('Failed to fetch trips:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [driverId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'canceled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return <div className="flex justify-center py-10">Loading trip history...</div>
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Recent Trips</CardTitle>
        </CardHeader>
        <CardContent>
          {trips.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <Package className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No trip history found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {trips.map((trip) => (
                <div 
                  key={trip.id} 
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex justify-between mb-2">
                    <div className="font-medium">Trip #{trip.trip_id}</div>
                    <Badge className={getStatusColor(trip.status)}>
                      {trip.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4" />
                      <div>
                        <div className="text-xs">Destination</div>
                        <div className="font-medium text-gray-900">{trip.destination}</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <div>
                        <div className="text-xs">Date</div>
                        <div className="font-medium text-gray-900">
                          {new Date(trip.start_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Truck className="h-4 w-4" />
                      <div>
                        <div className="text-xs">Distance</div>
                        <div className="font-medium text-gray-900">{trip.distance} km</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
