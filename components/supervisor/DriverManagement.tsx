'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { supabase } from '@/lib/supabase'
import { Check, X, CheckCircle, AlertCircle, MapPin, Phone, UserCheck } from 'lucide-react'

interface DriverManagementProps {
  supervisorId: string
}

export function DriverManagement({ supervisorId }: DriverManagementProps) {
  const [drivers, setDrivers] = useState<Array<any>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        setLoading(true)
        const { data, error } = await supabase
          .from('profiles')
          .select(`
            *,
            trip:trips(
              id,
              trip_id,
              status,
              origin,
              destination,
              start_time,
              estimated_arrival
            ),
            driver_rating:driver_ratings(
              rating,
              feedback,
              created_at
            ),
            truck:trucks(
              license_plate,
              make,
              model,
              status
            )
          `)
          .eq('role', 'driver')
          .eq('supervisor_id', supervisorId)
          .order('last_name', { ascending: true })
        
        if (error) throw error
        setDrivers(data || [])
      } catch (err: any) {
        setError(err.message)
        console.error('Error fetching drivers:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchDrivers()
  }, [supervisorId])
  
  const getDriverInitials = (driver: any) => {
    return `${driver.first_name?.[0] || ''}${driver.last_name?.[0] || ''}`.toUpperCase()
  }
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>
      case 'on_trip':
        return <Badge className="bg-blue-500">On Trip</Badge>
      case 'suspended':
        return <Badge className="bg-red-500">Suspended</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading driver information...</div>
  }
  
  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-800">
        <AlertCircle className="inline-block mr-2 h-5 w-5" />
        Failed to load driver data: {error}
      </div>
    )
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Driver Management</CardTitle>
        <CardDescription>Monitor and manage your assigned drivers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Drivers</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="on_trip">On Trip</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4">
            {drivers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No drivers assigned to you yet
              </div>
            ) : (
              <div className="grid gap-4">
                {drivers.map((driver) => (
                  <div key={driver.id} className="border rounded-lg p-4 flex flex-col md:flex-row md:items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={driver.avatar_url || ''} alt={`${driver.first_name} ${driver.last_name}`} />
                      <AvatarFallback>{getDriverInitials(driver)}</AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-grow">
                      <div className="font-medium">{driver.first_name} {driver.last_name}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Phone className="h-3 w-3 inline mr-1" />
                        {driver.phone || 'No phone'}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getStatusBadge(driver.status)}
                        {driver.trip?.[0]?.status === 'in_progress' && (
                          <Badge variant="outline" className="ml-2">On trip</Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0">
                      <div className="text-sm space-x-2">
                        <Button size="sm" variant="outline">
                          <UserCheck className="h-4 w-4 mr-1" />
                          Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <MapPin className="h-4 w-4 mr-1" />
                          Track
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="active">
            <div className="text-center py-8 text-gray-500">
              Filter for active drivers
            </div>
          </TabsContent>
          
          <TabsContent value="on_trip">
            <div className="text-center py-8 text-gray-500">
              Filter for drivers currently on trips
            </div>
          </TabsContent>
          
          <TabsContent value="issues">
            <div className="text-center py-8 text-gray-500">
              Filter for drivers with issues or incidents
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
