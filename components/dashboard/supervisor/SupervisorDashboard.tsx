'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Truck, 
  Users, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  TrendingUp,
  FileText,
  Settings
} from 'lucide-react'
import { formatCurrency, calculateSLA } from '@/lib/utils'

interface FleetStats {
  totalTrucks: number
  activeTrucks: number
  maintenanceTrucks: number
  totalDrivers: number
  activeDrivers: number
  pendingApprovals: number
  weeklyTrips: number
  slaCompliance: number
}

export function SupervisorDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<FleetStats>({
    totalTrucks: 45,
    activeTrucks: 38,
    maintenanceTrucks: 7,
    totalDrivers: 52,
    activeDrivers: 41,
    pendingApprovals: 12,
    weeklyTrips: 284,
    slaCompliance: 87
  })

  const [recentAlerts] = useState([
    {
      id: 1,
      type: 'maintenance',
      truck_id: 'TRK-001',
      message: 'Maintenance request approval needed',
      priority: 'high',
      time: '2 hours ago'
    },
    {
      id: 2,
      type: 'sla',
      driver: 'John Doe',
      message: 'Driver falling behind weekly targets',
      priority: 'medium',
      time: '4 hours ago'
    },
    {
      id: 3,
      type: 'incident',
      truck_id: 'TRK-023',
      message: 'Minor incident reported - review required',
      priority: 'high',
      time: '6 hours ago'
    }
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Supervisor Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {profile?.first_name}. Monitor and manage your fleet operations.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button variant="logistics">
            <Settings className="h-4 w-4 mr-2" />
            Fleet Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Fleet Status"
          value={`${stats.activeTrucks}/${stats.totalTrucks}`}
          subtitle="Active Trucks"
          icon={<Truck className="h-5 w-5" />}
          trend="+2 from yesterday"
          color="logistics"
        />
        
        <StatCard
          title="Driver Availability"
          value={`${stats.activeDrivers}/${stats.totalDrivers}`}
          subtitle="Active Drivers"
          icon={<Users className="h-5 w-5" />}
          trend="+5 this week"
          color="success"
        />
        
        <StatCard
          title="Pending Approvals"
          value={stats.pendingApprovals.toString()}
          subtitle="Require attention"
          icon={<AlertTriangle className="h-5 w-5" />}
          trend="12 pending"
          color="warning"
        />
        
        <StatCard
          title="SLA Compliance"
          value={`${stats.slaCompliance}%`}
          subtitle="This week"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="+3% from last week"
          color="success"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fleet Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="h-5 w-5 mr-2" />
                Fleet Overview
              </CardTitle>
              <CardDescription>
                Real-time status of your truck fleet
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="status">
                <TabsList>
                  <TabsTrigger value="status">Status</TabsTrigger>
                  <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                  <TabsTrigger value="performance">Performance</TabsTrigger>
                </TabsList>
                
                <TabsContent value="status" className="mt-4">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Active Trucks</span>
                      <Badge variant="success">{stats.activeTrucks} trucks</Badge>
                    </div>
                    <Progress value={(stats.activeTrucks / stats.totalTrucks) * 100} />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Under Maintenance</span>
                      <Badge variant="warning">{stats.maintenanceTrucks} trucks</Badge>
                    </div>
                    <Progress value={(stats.maintenanceTrucks / stats.totalTrucks) * 100} />
                  </div>
                </TabsContent>
                
                <TabsContent value="maintenance" className="mt-4">
                  <div className="space-y-3">
                    {[
                      { truck: 'TRK-001', type: 'Engine Service', priority: 'High', eta: '2 hours' },
                      { truck: 'TRK-015', type: 'Brake Check', priority: 'Medium', eta: '1 day' },
                      { truck: 'TRK-032', type: 'Oil Change', priority: 'Low', eta: '3 days' }
                    ].map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{item.truck}</p>
                          <p className="text-sm text-gray-600">{item.type}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={item.priority === 'High' ? 'destructive' : item.priority === 'Medium' ? 'warning' : 'default'}>
                            {item.priority}
                          </Badge>
                          <p className="text-sm text-gray-600 mt-1">ETA: {item.eta}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="performance" className="mt-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center p-3 bg-success-50 rounded-lg">
                        <p className="text-2xl font-bold text-success-600">{stats.weeklyTrips}</p>
                        <p className="text-sm text-success-700">Weekly Trips</p>
                      </div>
                      <div className="text-center p-3 bg-logistics-50 rounded-lg">
                        <p className="text-2xl font-bold text-logistics-600">{stats.slaCompliance}%</p>
                        <p className="text-sm text-logistics-700">SLA Compliance</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Alerts & Approvals */}
        <div className="space-y-6">
          {/* Recent Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentAlerts.map((alert) => (
                  <div key={alert.id} className="p-3 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant={alert.priority === 'high' ? 'destructive' : 'warning'}>
                        {alert.priority}
                      </Badge>
                      <span className="text-xs text-gray-500">{alert.time}</span>
                    </div>
                    <p className="text-sm font-medium mb-1">
                      {alert.truck_id || alert.driver}
                    </p>
                    <p className="text-xs text-gray-600">{alert.message}</p>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4">
                View All Alerts
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approve Maintenance ({stats.pendingApprovals})
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MapPin className="h-4 w-4 mr-2" />
                Track Fleet Location
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Generate SLA Report
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Manage Driver Assignments
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon, 
  trend, 
  color 
}: {
  title: string
  value: string
  subtitle: string
  icon: React.ReactNode
  trend: string
  color: 'logistics' | 'success' | 'warning' | 'danger'
}) {
  const colorClasses = {
    logistics: 'bg-logistics-500 text-white',
    success: 'bg-success-500 text-white',
    warning: 'bg-warning-500 text-white',
    danger: 'bg-danger-500 text-white'
  }

  return (
    <Card className="card-hover">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center text-sm">
          <TrendingUp className="h-4 w-4 text-success-500 mr-1" />
          <span className="text-success-600">{trend}</span>
        </div>
      </CardContent>
    </Card>
  )
}
