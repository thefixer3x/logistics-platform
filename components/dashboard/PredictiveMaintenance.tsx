'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  AlertTriangle, CheckCircle, Clock, Wrench, TrendingUp, 
  Calendar, DollarSign, Truck, Settings, Bell, FileText 
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

interface MaintenanceAlert {
  id: string
  truckId: string
  truckPlate: string
  component: string
  alertType: 'critical' | 'warning' | 'info'
  severity: number // 1-100
  predictedFailureDate: string
  currentCondition: number // percentage
  description: string
  recommendedAction: string
  estimatedCost: number
  createdAt: string
}

interface MaintenanceSchedule {
  id: string
  truckId: string
  truckPlate: string
  maintenanceType: 'preventive' | 'predictive' | 'corrective'
  scheduledDate: string
  component: string
  description: string
  estimatedCost: number
  estimatedDuration: number // hours
  priority: 'high' | 'medium' | 'low'
  status: 'scheduled' | 'in_progress' | 'completed' | 'overdue'
  assignedTechnician?: string
}

interface TruckHealthMetrics {
  truckId: string
  truckPlate: string
  overallHealth: number
  components: {
    engine: number
    transmission: number
    brakes: number
    tires: number
    electrical: number
    hydraulics: number
  }
  totalMileage: number
  lastMaintenanceDate: string
  nextMaintenanceDate: string
  operationalStatus: 'excellent' | 'good' | 'fair' | 'poor' | 'critical'
}

export default function PredictiveMaintenance() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState<MaintenanceAlert[]>([])
  const [schedules, setSchedules] = useState<MaintenanceSchedule[]>([])
  const [truckHealth, setTruckHealth] = useState<TruckHealthMetrics[]>([])
  const [selectedTruck, setSelectedTruck] = useState<TruckHealthMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [historicalData, setHistoricalData] = useState<any[]>([])
  

  useEffect(() => {
    fetchMaintenanceData()
  }, [])

  const fetchMaintenanceData = async () => {
    try {
      setLoading(true)
      
      // Mock maintenance alerts
      const mockAlerts: MaintenanceAlert[] = [
        {
          id: '1',
          truckId: 'truck-001',
          truckPlate: 'ABC-123-XY',
          component: 'Engine',
          alertType: 'critical',
          severity: 85,
          predictedFailureDate: '2024-01-15',
          currentCondition: 15,
          description: 'Engine temperature running high, potential cooling system failure',
          recommendedAction: 'Schedule immediate inspection of cooling system and radiator',
          estimatedCost: 75000,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          truckId: 'truck-002',
          truckPlate: 'DEF-456-XY',
          component: 'Brakes',
          alertType: 'warning',
          severity: 65,
          predictedFailureDate: '2024-01-20',
          currentCondition: 35,
          description: 'Brake pad wear detected, replacement needed soon',
          recommendedAction: 'Schedule brake pad inspection and replacement within 7 days',
          estimatedCost: 45000,
          createdAt: new Date().toISOString()
        },
        {
          id: '3',
          truckId: 'truck-003',
          truckPlate: 'GHI-789-XY',
          component: 'Transmission',
          alertType: 'info',
          severity: 40,
          predictedFailureDate: '2024-02-01',
          currentCondition: 60,
          description: 'Transmission fluid needs replacement',
          recommendedAction: 'Schedule routine transmission service',
          estimatedCost: 25000,
          createdAt: new Date().toISOString()
        }
      ]

      // Mock maintenance schedules
      const mockSchedules: MaintenanceSchedule[] = [
        {
          id: '1',
          truckId: 'truck-001',
          truckPlate: 'ABC-123-XY',
          maintenanceType: 'predictive',
          scheduledDate: '2024-01-12',
          component: 'Engine Cooling System',
          description: 'Inspection and repair of cooling system components',
          estimatedCost: 75000,
          estimatedDuration: 4,
          priority: 'high',
          status: 'scheduled',
          assignedTechnician: 'Mike Johnson'
        },
        {
          id: '2',
          truckId: 'truck-002',
          truckPlate: 'DEF-456-XY',
          maintenanceType: 'preventive',
          scheduledDate: '2024-01-18',
          component: 'Brake System',
          description: 'Brake pad replacement and system inspection',
          estimatedCost: 45000,
          estimatedDuration: 3,
          priority: 'medium',
          status: 'scheduled',
          assignedTechnician: 'Sarah Williams'
        },
        {
          id: '3',
          truckId: 'truck-004',
          truckPlate: 'JKL-012-XY',
          maintenanceType: 'preventive',
          scheduledDate: '2024-01-10',
          component: 'General Service',
          description: 'Routine 10,000km service and inspection',
          estimatedCost: 30000,
          estimatedDuration: 2,
          priority: 'low',
          status: 'overdue',
          assignedTechnician: 'David Brown'
        }
      ]

      // Mock truck health metrics
      const mockTruckHealth: TruckHealthMetrics[] = [
        {
          truckId: 'truck-001',
          truckPlate: 'ABC-123-XY',
          overallHealth: 65,
          components: {
            engine: 15,
            transmission: 85,
            brakes: 90,
            tires: 70,
            electrical: 95,
            hydraulics: 80
          },
          totalMileage: 125000,
          lastMaintenanceDate: '2023-12-15',
          nextMaintenanceDate: '2024-01-15',
          operationalStatus: 'poor'
        },
        {
          truckId: 'truck-002',
          truckPlate: 'DEF-456-XY',
          overallHealth: 78,
          components: {
            engine: 90,
            transmission: 88,
            brakes: 35,
            tires: 65,
            electrical: 92,
            hydraulics: 85
          },
          totalMileage: 89000,
          lastMaintenanceDate: '2023-12-20',
          nextMaintenanceDate: '2024-01-20',
          operationalStatus: 'fair'
        },
        {
          truckId: 'truck-003',
          truckPlate: 'GHI-789-XY',
          overallHealth: 92,
          components: {
            engine: 95,
            transmission: 60,
            brakes: 95,
            tires: 85,
            electrical: 98,
            hydraulics: 90
          },
          totalMileage: 45000,
          lastMaintenanceDate: '2023-12-25',
          nextMaintenanceDate: '2024-02-01',
          operationalStatus: 'excellent'
        }
      ]

      // Mock historical data for charts
      const mockHistoricalData = [
        { month: 'Jul', maintenanceCost: 120000, downtime: 24, reliability: 94 },
        { month: 'Aug', maintenanceCost: 95000, downtime: 18, reliability: 96 },
        { month: 'Sep', maintenanceCost: 110000, downtime: 22, reliability: 95 },
        { month: 'Oct', maintenanceCost: 85000, downtime: 15, reliability: 97 },
        { month: 'Nov', maintenanceCost: 140000, downtime: 28, reliability: 93 },
        { month: 'Dec', maintenanceCost: 75000, downtime: 12, reliability: 98 }
      ]

      setAlerts(mockAlerts)
      setSchedules(mockSchedules)
      setTruckHealth(mockTruckHealth)
      setSelectedTruck(mockTruckHealth[0])
      setHistoricalData(mockHistoricalData)
      
    } catch (error) {
      console.error('Error fetching maintenance data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getAlertColor = (alertType: string) => {
    switch (alertType) {
      case 'critical': return 'destructive'
      case 'warning': return 'secondary'
      case 'info': return 'outline'
      default: return 'outline'
    }
  }

  const getHealthColor = (health: number) => {
    if (health >= 80) return 'text-green-600'
    if (health >= 60) return 'text-yellow-600'
    if (health >= 40) return 'text-orange-600'
    return 'text-red-600'
  }

  const getHealthStatus = (health: number) => {
    if (health >= 90) return 'Excellent'
    if (health >= 75) return 'Good'
    if (health >= 50) return 'Fair'
    if (health >= 25) return 'Poor'
    return 'Critical'
  }

  const scheduleMaintenanceAlert = async (alertId: string) => {
    try {
      const alert = alerts.find(a => a.id === alertId)
      if (alert) {
        const newSchedule: MaintenanceSchedule = {
          id: `schedule-${Date.now()}`,
          truckId: alert.truckId,
          truckPlate: alert.truckPlate,
          maintenanceType: 'predictive',
          scheduledDate: alert.predictedFailureDate,
          component: alert.component,
          description: alert.description,
          estimatedCost: alert.estimatedCost,
          estimatedDuration: 3,
          priority: alert.alertType === 'critical' ? 'high' : 'medium',
          status: 'scheduled'
        }
        setSchedules(prev => [...prev, newSchedule])
      }
    } catch (error) {
      console.error('Error scheduling maintenance:', error)
    }
  }

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-32 rounded-lg mb-4" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Predictive Maintenance</h1>
          <p className="text-gray-600">AI-powered maintenance scheduling and health monitoring</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure Alerts
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">
                  {alerts.filter(a => a.alertType === 'critical').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled Maintenance</p>
                <p className="text-2xl font-bold text-blue-600">
                  {schedules.filter(s => s.status === 'scheduled').length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Fleet Health</p>
                <p className="text-2xl font-bold text-green-600">
                  {Math.round(truckHealth.reduce((sum, truck) => sum + truck.overallHealth, 0) / truckHealth.length)}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Cost</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₦{historicalData[historicalData.length - 1]?.maintenanceCost.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="alerts">Alerts</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="health">Fleet Health</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="alerts" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="border-l-4 border-l-red-500">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={getAlertColor(alert.alertType)}>
                          {alert.alertType.toUpperCase()}
                        </Badge>
                        <span className="font-medium">{alert.truckPlate}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{alert.component}</span>
                      </div>
                      <p className="text-sm text-gray-800 mb-2">{alert.description}</p>
                      <p className="text-sm text-blue-600 mb-3">{alert.recommendedAction}</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Predicted Failure:</span>
                          <div className="font-medium">
                            {new Date(alert.predictedFailureDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Current Condition:</span>
                          <div className="flex items-center space-x-2">
                            <Progress value={alert.currentCondition} className="w-16 h-2" />
                            <span className="font-medium">{alert.currentCondition}%</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Estimated Cost:</span>
                          <div className="font-medium">₦{alert.estimatedCost.toLocaleString()}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button 
                        size="sm" 
                        onClick={() => scheduleMaintenanceAlert(alert.id)}
                      >
                        Schedule
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {schedules.map((schedule) => (
              <Card key={schedule.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge variant={schedule.status === 'overdue' ? 'destructive' : 'default'}>
                          {schedule.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <span className="font-medium">{schedule.truckPlate}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-gray-600">{schedule.component}</span>
                      </div>
                      <p className="text-sm text-gray-800 mb-3">{schedule.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Scheduled Date:</span>
                          <div className="font-medium">
                            {new Date(schedule.scheduledDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <div className="font-medium">{schedule.estimatedDuration}h</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Cost:</span>
                          <div className="font-medium">₦{schedule.estimatedCost.toLocaleString()}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Technician:</span>
                          <div className="font-medium">{schedule.assignedTechnician || 'Unassigned'}</div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <Button size="sm" variant="outline">
                        <Wrench className="h-4 w-4 mr-2" />
                        Assign
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="health" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Truck List */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Fleet Health Status</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="space-y-2">
                    {truckHealth.map((truck) => (
                      <div
                        key={truck.truckId}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                          selectedTruck?.truckId === truck.truckId ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedTruck(truck)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">{truck.truckPlate}</span>
                          <Badge variant={truck.operationalStatus === 'excellent' ? 'default' : 'secondary'}>
                            {truck.operationalStatus}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={truck.overallHealth} className="flex-1 h-2" />
                          <span className={`text-sm font-medium ${getHealthColor(truck.overallHealth)}`}>
                            {truck.overallHealth}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Truck Details */}
            <div className="lg:col-span-2">
              {selectedTruck && (
                <Card>
                  <CardHeader>
                    <CardTitle>Truck Health Details - {selectedTruck.truckPlate}</CardTitle>
                    <CardDescription>
                      Overall Health: {selectedTruck.overallHealth}% • Status: {getHealthStatus(selectedTruck.overallHealth)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Component Health */}
                      <div>
                        <h4 className="font-medium mb-4">Component Health</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(selectedTruck.components).map(([component, health]) => (
                            <div key={component} className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm capitalize">{component}:</span>
                                <span className={`text-sm font-medium ${getHealthColor(health)}`}>
                                  {health}%
                                </span>
                              </div>
                              <Progress value={health} className="h-2" />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Maintenance Info */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Maintenance History</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span>Total Mileage:</span>
                              <span className="font-medium">{selectedTruck.totalMileage.toLocaleString()} km</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Last Maintenance:</span>
                              <span className="font-medium">
                                {new Date(selectedTruck.lastMaintenanceDate).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span>Next Maintenance:</span>
                              <span className="font-medium">
                                {new Date(selectedTruck.nextMaintenanceDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Recommendations</h4>
                          <div className="space-y-2 text-sm">
                            {selectedTruck.overallHealth < 70 && (
                              <div className="p-2 bg-red-50 text-red-700 rounded">
                                Schedule immediate inspection
                              </div>
                            )}
                            {Object.entries(selectedTruck.components).some(([_, health]) => health < 50) && (
                              <div className="p-2 bg-yellow-50 text-yellow-700 rounded">
                                Critical components need attention
                              </div>
                            )}
                            <div className="p-2 bg-blue-50 text-blue-700 rounded">
                              Regular preventive maintenance scheduled
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Maintenance Cost Trend</CardTitle>
                <CardDescription>Monthly maintenance expenses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`₦${value.toLocaleString()}`, 'Cost']} />
                    <Line type="monotone" dataKey="maintenanceCost" stroke="#2563eb" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Fleet Reliability</CardTitle>
                <CardDescription>Reliability percentage over time</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={historicalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[90, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, 'Reliability']} />
                    <Bar dataKey="reliability" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
