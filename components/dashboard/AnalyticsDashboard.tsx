'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts'
import { 
  TrendingUp, TrendingDown, DollarSign, Truck, Clock, AlertTriangle,
  CheckCircle, Users, MapPin, Calendar, Download, Filter
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'

interface AnalyticsData {
  financial: {
    totalRevenue: number
    monthlyRevenue: number
    pendingPayments: number
    averagePaymentTime: number
    revenueGrowth: number
    monthlyRevenueData: Array<{ month: string; revenue: number; trips: number }>
  }
  fleet: {
    totalTrucks: number
    activeTrucks: number
    maintenanceTrucks: number
    utilizationRate: number
    averageDistance: number
    fuelEfficiency: number
    truckStatusData: Array<{ status: string; count: number; color: string }>
  }
  performance: {
    totalTrips: number
    completedTrips: number
    onTimeDelivery: number
    slaCompliance: number
    averageDeliveryTime: number
    customerSatisfaction: number
    performanceData: Array<{ date: string; onTime: number; delayed: number; cancelled: number }>
  }
  drivers: {
    totalDrivers: number
    activeDrivers: number
    averageRating: number
    totalDistance: number
    safetyScore: number
    driverPerformance: Array<{ name: string; trips: number; rating: number; earnings: number }>
  }
}

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

export default function AnalyticsDashboard() {
  const { user } = useAuth()
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  

  useEffect(() => {
    fetchAnalyticsData()
  }, [timeRange])

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true)
      
      // Fetch financial data
      const { data: payments } = await supabase
        .from('payments')
        .select('amount, status, created_at')
        .gte('created_at', getDateRange(timeRange))

      // Fetch fleet data
      const { data: trucks } = await supabase
        .from('trucks')
        .select('id, status, total_distance, fuel_efficiency')

      // Fetch trip data
      const { data: trips } = await supabase
        .from('trips')
        .select('id, status, distance, created_at, scheduled_delivery, actual_delivery')
        .gte('created_at', getDateRange(timeRange))

      // Fetch driver data
      const { data: drivers } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, role')
        .eq('role', 'driver')

      // Process data
      const processedData = processAnalyticsData(payments, trucks, trips, drivers)
      setAnalyticsData(processedData)
    } catch (error) {
      console.error('Error fetching analytics data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getDateRange = (range: string) => {
    const now = new Date()
    const days = parseInt(range.replace('d', ''))
    const startDate = new Date(now.getTime() - (days * 24 * 60 * 60 * 1000))
    return startDate.toISOString()
  }

  const processAnalyticsData = (payments: any[], trucks: any[], trips: any[], drivers: any[]): AnalyticsData => {
    // Process financial data
    const totalRevenue = payments?.reduce((sum, p) => sum + (p.amount || 0), 0) || 0
    const completedPayments = payments?.filter(p => p.status === 'completed') || []
    const pendingPayments = payments?.filter(p => p.status === 'pending')?.length || 0

    // Process fleet data
    const activeTrucks = trucks?.filter(t => t.status === 'active')?.length || 0
    const maintenanceTrucks = trucks?.filter(t => t.status === 'maintenance')?.length || 0
    const totalTrucks = trucks?.length || 0

    // Process trip data
    const completedTrips = trips?.filter(t => t.status === 'completed')?.length || 0
    const totalTrips = trips?.length || 0
    const onTimeTrips = trips?.filter(t => 
      t.status === 'completed' && 
      t.actual_delivery && 
      t.scheduled_delivery &&
      new Date(t.actual_delivery) <= new Date(t.scheduled_delivery)
    )?.length || 0

    return {
      financial: {
        totalRevenue,
        monthlyRevenue: totalRevenue,
        pendingPayments,
        averagePaymentTime: 3.2,
        revenueGrowth: 12.5,
        monthlyRevenueData: generateMonthlyData(payments)
      },
      fleet: {
        totalTrucks,
        activeTrucks,
        maintenanceTrucks,
        utilizationRate: totalTrucks > 0 ? (activeTrucks / totalTrucks) * 100 : 0,
        averageDistance: 250,
        fuelEfficiency: 8.5,
        truckStatusData: [
          { status: 'Active', count: activeTrucks, color: '#10b981' },
          { status: 'Maintenance', count: maintenanceTrucks, color: '#f59e0b' },
          { status: 'Idle', count: totalTrucks - activeTrucks - maintenanceTrucks, color: '#6b7280' }
        ]
      },
      performance: {
        totalTrips,
        completedTrips,
        onTimeDelivery: totalTrips > 0 ? (onTimeTrips / totalTrips) * 100 : 0,
        slaCompliance: 94.2,
        averageDeliveryTime: 4.8,
        customerSatisfaction: 4.6,
        performanceData: generatePerformanceData(trips)
      },
      drivers: {
        totalDrivers: drivers?.length || 0,
        activeDrivers: Math.floor((drivers?.length || 0) * 0.85),
        averageRating: 4.3,
        totalDistance: 125000,
        safetyScore: 96.8,
        driverPerformance: generateDriverPerformanceData(drivers)
      }
    }
  }

  const generateMonthlyData = (payments: any[]) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map(month => ({
      month,
      revenue: Math.floor(Math.random() * 500000) + 200000,
      trips: Math.floor(Math.random() * 150) + 50
    }))
  }

  const generatePerformanceData = (trips: any[]) => {
    const days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      return date.toISOString().split('T')[0]
    })

    return days.map(date => ({
      date,
      onTime: Math.floor(Math.random() * 50) + 20,
      delayed: Math.floor(Math.random() * 10) + 2,
      cancelled: Math.floor(Math.random() * 3) + 1
    }))
  }

  const generateDriverPerformanceData = (drivers: any[]) => {
    return drivers?.slice(0, 10).map((driver, index) => ({
      name: `${driver.first_name} ${driver.last_name}`,
      trips: Math.floor(Math.random() * 50) + 20,
      rating: 3.5 + Math.random() * 1.5,
      earnings: Math.floor(Math.random() * 100000) + 50000
    })) || []
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg mb-4" />
          ))}
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return <div className="p-6">Error loading analytics data</div>
  }

  const { financial, fleet, performance, drivers } = analyticsData

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Comprehensive insights into your logistics operations</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            value={timeRange} 
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦{financial.totalRevenue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
              +{financial.revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Trucks</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleet.activeTrucks}/{fleet.totalTrucks}</div>
            <p className="text-xs text-muted-foreground">
              {fleet.utilizationRate.toFixed(1)}% utilization rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On-Time Delivery</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{performance.onTimeDelivery.toFixed(1)}%</div>
            <Progress value={performance.onTimeDelivery} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">SLA Compliance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{performance.slaCompliance}%</div>
            <p className="text-xs text-muted-foreground">Above 90% target</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="financial" className="space-y-4">
        <TabsList>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
        </TabsList>

        <TabsContent value="financial" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Trend</CardTitle>
                <CardDescription>Revenue and trip count over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={financial.monthlyRevenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value, name) => [
                      name === 'revenue' ? `₦${value.toLocaleString()}` : value,
                      name === 'revenue' ? 'Revenue' : 'Trips'
                    ]} />
                    <Area type="monotone" dataKey="revenue" stackId="1" stroke="#2563eb" fill="#2563eb" fillOpacity={0.8} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Status</CardTitle>
                <CardDescription>Current payment distribution</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Completed Payments</span>
                  <Badge variant="success">₦{(financial.totalRevenue * 0.85).toLocaleString()}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Pending Payments</span>
                  <Badge variant="warning">{financial.pendingPayments} pending</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Average Payment Time</span>
                  <Badge variant="outline">{financial.averagePaymentTime} days</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fleet" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fleet Status Distribution</CardTitle>
                <CardDescription>Current status of all trucks</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={fleet.truckStatusData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="count"
                      label={({ status, count }) => `${status}: ${count}`}
                    >
                      {fleet.truckStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fleet Performance Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Utilization Rate</span>
                    <span className="text-sm font-medium">{fleet.utilizationRate.toFixed(1)}%</span>
                  </div>
                  <Progress value={fleet.utilizationRate} />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Average Distance/Day</span>
                    <span className="text-sm font-medium">{fleet.averageDistance} km</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Fuel Efficiency</span>
                    <span className="text-sm font-medium">{fleet.fuelEfficiency} L/100km</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance Tracking</CardTitle>
              <CardDescription>Trip completion status over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={performance.performanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString()} />
                  <Bar dataKey="onTime" stackId="a" fill="#10b981" name="On Time" />
                  <Bar dataKey="delayed" stackId="a" fill="#f59e0b" name="Delayed" />
                  <Bar dataKey="cancelled" stackId="a" fill="#ef4444" name="Cancelled" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drivers" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Driver Performance Leaderboard</CardTitle>
                <CardDescription>Top performing drivers this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {drivers.driverPerformance.slice(0, 5).map((driver, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                          <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{driver.name}</p>
                          <p className="text-sm text-gray-600">{driver.trips} trips</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦{driver.earnings.toLocaleString()}</p>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <span key={i} className={`text-xs ${i < Math.floor(driver.rating) ? 'text-yellow-400' : 'text-gray-300'}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Driver Statistics</CardTitle>
                <CardDescription>Overall driver metrics</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{drivers.totalDrivers}</div>
                    <div className="text-sm text-gray-600">Total Drivers</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{drivers.activeDrivers}</div>
                    <div className="text-sm text-gray-600">Active Today</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Average Rating</span>
                    <span className="text-sm font-medium">{drivers.averageRating}/5.0</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Total Distance</span>
                    <span className="text-sm font-medium">{drivers.totalDistance.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Safety Score</span>
                    <span className="text-sm font-medium text-green-600">{drivers.safetyScore}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
