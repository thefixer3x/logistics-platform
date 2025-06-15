'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Truck, 
  MapPin, 
  DollarSign, 
  Users, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  BarChart3,
  Route,
  Wrench,
  Bell
} from 'lucide-react'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ConnectionStatusHandler } from '@/components/ConnectionStatusHandler'

export default function DemoDashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock data for demonstration
  const fleetStats = {
    totalTrucks: 24,
    activeTrucks: 18,
    inMaintenance: 3,
    tripsInProgress: 12,
    onTimeDeliveries: 94.2,
    totalRevenue: 2450000,
    monthlyGrowth: 12.5
  }

  const recentTrips = [
    { id: 1, origin: 'Lagos', destination: 'Abuja', driver: 'Musa Abdullahi', status: 'in_progress', progress: 65 },
    { id: 2, origin: 'Kano', destination: 'Port Harcourt', driver: 'Folake Adeyemi', status: 'completed', progress: 100 },
    { id: 3, origin: 'Ibadan', destination: 'Lagos', driver: 'Ahmed Sani', status: 'pending', progress: 0 },
    { id: 4, origin: 'Abuja', destination: 'Kaduna', driver: 'Grace Okonkwo', status: 'in_progress', progress: 30 }
  ]

  const maintenanceAlerts = [
    { truck: 'LG-001-ABC', issue: 'Engine service due', priority: 'high', dueDate: '2025-06-15' },
    { truck: 'AB-234-XYZ', issue: 'Tire replacement needed', priority: 'medium', dueDate: '2025-06-20' },
    { truck: 'KN-456-DEF', issue: 'Oil change required', priority: 'low', dueDate: '2025-06-25' }
  ]

  const paymentStats = [
    { type: 'Daily Allowances', amount: 340000, count: 68, status: 'processed' },
    { type: 'Trip Payments', amount: 1250000, count: 45, status: 'processing' },
    { type: 'Maintenance Costs', amount: 180000, count: 12, status: 'pending' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SefTech Logistics Platform</h1>
            <p className="text-sm text-gray-600">Comprehensive Demo Dashboard</p>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              Demo Mode
            </Badge>
            <Button variant="outline" size="sm">
              <a href="/test-setup" className="flex items-center">
                <Wrench className="h-4 w-4 mr-2" />
                Setup Database
              </a>
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        <ErrorBoundary>
          <ConnectionStatusHandler>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="fleet">Fleet Management</TabsTrigger>
                <TabsTrigger value="payments">Payments</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Trucks</CardTitle>
                  <Truck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{fleetStats.totalTrucks}</div>
                  <p className="text-xs text-muted-foreground">
                    {fleetStats.activeTrucks} active, {fleetStats.inMaintenance} in maintenance
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Trips</CardTitle>
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{fleetStats.tripsInProgress}</div>
                  <p className="text-xs text-muted-foreground">
                    {fleetStats.onTimeDeliveries}% on-time delivery rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₦{fleetStats.totalRevenue.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">
                    +{fleetStats.monthlyGrowth}% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Drivers</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">42</div>
                  <p className="text-xs text-muted-foreground">
                    8 contractors, 34 employed drivers
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Trips</CardTitle>
                  <CardDescription>Latest trip activities and status updates</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentTrips.map((trip) => (
                    <div key={trip.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{trip.origin} → {trip.destination}</div>
                        <div className="text-sm text-gray-600">{trip.driver}</div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={trip.status === 'completed' ? 'default' : trip.status === 'in_progress' ? 'secondary' : 'outline'}
                          className={
                            trip.status === 'completed' ? 'bg-green-500' : 
                            trip.status === 'in_progress' ? 'bg-blue-500' : 
                            'bg-gray-500'
                          }
                        >
                          {trip.status.replace('_', ' ')}
                        </Badge>
                        <div className="text-sm text-gray-500 mt-1">{trip.progress}%</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Maintenance Alerts</CardTitle>
                  <CardDescription>Upcoming maintenance and service requirements</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {maintenanceAlerts.map((alert, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <div className="font-medium">{alert.truck}</div>
                        <div className="text-sm text-gray-600">{alert.issue}</div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={alert.priority === 'high' ? 'destructive' : alert.priority === 'medium' ? 'default' : 'secondary'}
                        >
                          {alert.priority}
                        </Badge>
                        <div className="text-sm text-gray-500 mt-1">{alert.dueDate}</div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="fleet" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle>Fleet Status Overview</CardTitle>
                  <CardDescription>Real-time status of all vehicles in your fleet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{fleetStats.activeTrucks}</div>
                        <div className="text-sm text-green-700">Active</div>
                      </div>
                      <div className="p-4 bg-yellow-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">{fleetStats.inMaintenance}</div>
                        <div className="text-sm text-yellow-700">Maintenance</div>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-600">3</div>
                        <div className="text-sm text-gray-700">Inactive</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full" variant="outline">
                    <Route className="h-4 w-4 mr-2" />
                    Optimize Routes
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Wrench className="h-4 w-4 mr-2" />
                    Schedule Maintenance
                  </Button>
                  <Button className="w-full" variant="outline">
                    <Bell className="h-4 w-4 mr-2" />
                    Send Notifications
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment Processing Overview</CardTitle>
                <CardDescription>Current payment status and recent transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {paymentStats.map((stat, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <div className="font-medium text-sm text-gray-600">{stat.type}</div>
                      <div className="text-2xl font-bold mt-1">₦{stat.amount.toLocaleString()}</div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="text-sm text-gray-500">{stat.count} transactions</div>
                        <Badge 
                          variant={stat.status === 'processed' ? 'default' : stat.status === 'processing' ? 'secondary' : 'outline'}
                          className={stat.status === 'processed' ? 'bg-green-500' : ''}
                        >
                          {stat.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Performance Metrics</CardTitle>
                  <CardDescription>Key performance indicators for your logistics operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>On-time Delivery Rate</span>
                      <span className="font-bold text-green-600">{fleetStats.onTimeDeliveries}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fleet Utilization</span>
                      <span className="font-bold text-blue-600">85.2%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Average Trip Duration</span>
                      <span className="font-bold">4.2 hours</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Fuel Efficiency</span>
                      <span className="font-bold text-green-600">12.5 km/L</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>SLA Compliance</CardTitle>
                  <CardDescription>Service level agreement performance tracking</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Contract Compliance</span>
                      <Badge className="bg-green-500">98.5%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Penalty Avoided</span>
                      <span className="font-bold text-green-600">₦45,000</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Driver Welfare Score</span>
                      <Badge className="bg-blue-500">92%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
          </ConnectionStatusHandler>
        </ErrorBoundary>
      </div>
    </div>
  )
}
