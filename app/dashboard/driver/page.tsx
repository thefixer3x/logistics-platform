import { Suspense } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign, 
  AlertTriangle,
  CheckCircle,
  Navigation,
  Phone
} from 'lucide-react'
import { DriverStatsCards } from '@/components/driver/DriverStatsCards'
import { TripHistory } from '@/components/driver/TripHistory'
import { PaymentSummary } from '@/components/driver/PaymentSummary'
import { LiveMap } from '@/components/maps/LiveMap'
import { EmergencyContact } from '@/components/driver/EmergencyContact'

export default async function DriverDashboard() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get driver profile and current assignment
  const [
    { data: profile },
    { data: currentTrip },
    { data: stats }
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select(`
        *,
        assigned_truck:trucks(*)
      `)
      .eq('id', session?.user.id)
      .single(),
    
    supabase
      .from('trips')
      .select('*')
      .eq('driver_id', session?.user.id)
      .eq('status', 'in_progress')
      .single(),
    
    supabase
      .from('driver_stats')
      .select('*')
      .eq('driver_id', session?.user.id)
      .single()
  ])

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {profile?.first_name}!
          </h1>
          <p className="text-gray-600 mt-1">
            {currentTrip ? 'You have an active trip in progress' : 'Ready for your next assignment'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge 
            variant={profile?.status === 'active' ? 'default' : 'secondary'}
            className="px-3 py-1"
          >
            {profile?.status || 'inactive'}
          </Badge>
          <EmergencyContact driverId={''} />
        </div>
      </div>

      {/* Current Trip Status */}
      {currentTrip && (
        <Card className="border-logistics-200 bg-logistics-50">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center text-logistics-800">
                <Navigation className="h-5 w-5 mr-2" />
                Current Trip: {currentTrip.trip_id}
              </CardTitle>
              <Badge variant="outline" className="bg-success-100 text-success-800 border-success-300">
                In Progress
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Destination</p>
                  <p className="font-medium">{currentTrip.destination}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">ETA</p>
                  <p className="font-medium">{currentTrip.estimated_arrival}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Load Status</p>
                  <p className="font-medium">{currentTrip.load_status}</p>
                </div>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button size="sm" className="bg-logistics-600 hover:bg-logistics-700">
                Update Location
              </Button>
              <Button size="sm" variant="outline">
                Report Issue
              </Button>
              <Button size="sm" variant="outline">
                Contact Supervisor
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Overview */}
      <Suspense fallback={<div>Loading stats...</div>}>
        <DriverStatsCards stats={stats} />
      </Suspense>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trips">Trip History</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="map">Live Map</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weekly Performance */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Performance</CardTitle>
                <CardDescription>Your progress this week</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Trips Completed</span>
                    <span>{stats?.weekly_trips || 0}/10</span>
                  </div>
                  <Progress value={(stats?.weekly_trips || 0) * 10} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>On-Time Delivery</span>
                    <span>{stats?.on_time_percentage || 0}%</span>
                  </div>
                  <Progress value={stats?.on_time_percentage || 0} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Safety Score</span>
                    <span>{stats?.safety_score || 0}/100</span>
                  </div>
                  <Progress value={stats?.safety_score || 0} />
                </div>
              </CardContent>
            </Card>

            {/* Truck Assignment */}
            <Card>
              <CardHeader>
                <CardTitle>Assigned Truck</CardTitle>
                <CardDescription>Your current vehicle assignment</CardDescription>
              </CardHeader>
              <CardContent>
                {profile?.assigned_truck ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">
                        {profile.assigned_truck.make} {profile.assigned_truck.model}
                      </span>
                      <Badge variant={profile.assigned_truck.status === 'active' ? 'default' : 'secondary'}>
                        {profile.assigned_truck.status}
                      </Badge>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>Plate: {profile.assigned_truck.license_plate}</p>
                      <p>Last Maintenance: {profile.assigned_truck.last_maintenance}</p>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      Report Maintenance Issue
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-gray-500">
                    <Truck className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No truck assigned</p>
                    <Button size="sm" className="mt-2">
                      Request Assignment
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="trips">
          <Suspense fallback={<div>Loading trip history...</div>}>
            <TripHistory driverId={session?.user.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="payments">
          <Suspense fallback={<div>Loading payment information...</div>}>
            <PaymentSummary driverId={session?.user.id} />
          </Suspense>
        </TabsContent>

        <TabsContent value="map">
          <Card>
            <CardHeader>
              <CardTitle>Live Location Tracking</CardTitle>
              <CardDescription>
                Your current location and route information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96 rounded-lg overflow-hidden">
                <Suspense fallback={<div className="h-full bg-gray-100 flex items-center justify-center">Loading map...</div>}>
                  <LiveMap driverId={session?.user.id} />
                </Suspense>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
