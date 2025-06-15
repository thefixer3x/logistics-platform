'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3, 
  Download, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Truck
} from 'lucide-react'
import { formatCurrency, calculateSLA, formatDate } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

interface SLAData {
  period: string
  target: number
  completed: number
  compliance: number
  revenue: number
  penalties: number
}

interface DriverSLA {
  id: string
  name: string
  truck_id: string
  weekly_target: number
  completed_trips: number
  compliance: number
  status: 'excellent' | 'good' | 'warning' | 'critical'
}

export function SLAReportDashboard() {
  const { profile } = useAuth()
  const [slaData, setSlaData] = useState<SLAData[]>([])
  const [driverSLAs, setDriverSLAs] = useState<DriverSLA[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedPeriod, setSelectedPeriod] = useState('current_week')
  
  

  useEffect(() => {
    fetchSLAData()
  }, [selectedPeriod])

  const fetchSLAData = async () => {
    setLoading(true)
    try {
      // Fetch trip data for SLA calculations
      const { data: trips } = await supabase
        .from('trips')
        .select(`
          *,
          truck:trucks(license_plate, driver_id),
          driver:profiles(first_name, last_name)
        `)
        .gte('created_at', getStartDate(selectedPeriod))
        .lte('created_at', getEndDate(selectedPeriod))

      if (trips) {
        const slaResults = calculateSLAMetrics(trips)
        setSlaData(slaResults.periodicData)
        setDriverSLAs(slaResults.driverData)
      }
    } catch (error) {
      console.error('Error fetching SLA data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStartDate = (period: string): string => {
    const now = new Date()
    switch (period) {
      case 'current_week':
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
        return startOfWeek.toISOString()
      case 'last_week':
        const lastWeekStart = new Date(now.setDate(now.getDate() - now.getDay() - 7))
        return lastWeekStart.toISOString()
      case 'current_month':
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString()
      case 'last_month':
        return new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString()
      default:
        return new Date(now.setDate(now.getDate() - 7)).toISOString()
    }
  }

  const getEndDate = (period: string): string => {
    const now = new Date()
    switch (period) {
      case 'current_week':
        return new Date(now.setDate(now.getDate() - now.getDay() + 6)).toISOString()
      case 'last_week':
        return new Date(now.setDate(now.getDate() - now.getDay() - 1)).toISOString()
      case 'current_month':
        return new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString()
      case 'last_month':
        return new Date(now.getFullYear(), now.getMonth(), 0).toISOString()
      default:
        return now.toISOString()
    }
  }

  const calculateSLAMetrics = (trips: any[]) => {
    // Group trips by week and driver
    const weeklyData: { [key: string]: SLAData } = {}
    const driverData: { [key: string]: DriverSLA } = {}

    trips.forEach(trip => {
      const weekKey = getWeekKey(trip.created_at)
      const driverKey = trip.driver_id

      // Initialize weekly data
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = {
          period: weekKey,
          target: 20, // Default weekly target
          completed: 0,
          compliance: 0,
          revenue: 0,
          penalties: 0
        }
      }

      // Initialize driver data
      if (!driverData[driverKey]) {
        driverData[driverKey] = {
          id: driverKey,
          name: `${trip.driver?.first_name} ${trip.driver?.last_name}`,
          truck_id: trip.truck?.license_plate || '',
          weekly_target: 20,
          completed_trips: 0,
          compliance: 0,
          status: 'good'
        }
      }

      // Count completed trips
      if (trip.status === 'completed') {
        weeklyData[weekKey].completed += 1
        driverData[driverKey].completed_trips += 1
        weeklyData[weekKey].revenue += trip.payment_amount || 0
      }
    })

    // Calculate compliance percentages and statuses
    Object.values(weeklyData).forEach(week => {
      week.compliance = calculateSLA(week.completed, week.target)
    })

    Object.values(driverData).forEach(driver => {
      driver.compliance = calculateSLA(driver.completed_trips, driver.weekly_target)
      driver.status = getComplianceStatus(driver.compliance)
    })

    return {
      periodicData: Object.values(weeklyData),
      driverData: Object.values(driverData)
    }
  }

  const getWeekKey = (dateString: string): string => {
    const date = new Date(dateString)
    const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()))
    return `Week of ${formatDate(startOfWeek)}`
  }

  const getComplianceStatus = (compliance: number): 'excellent' | 'good' | 'warning' | 'critical' => {
    if (compliance >= 95) return 'excellent'
    if (compliance >= 80) return 'good'
    if (compliance >= 60) return 'warning'
    return 'critical'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success'
      case 'good': return 'default'
      case 'warning': return 'warning'
      case 'critical': return 'destructive'
      default: return 'default'
    }
  }

  const generateReport = async () => {
    try {
      const reportData = {
        period: selectedPeriod,
        generated_at: new Date().toISOString(),
        sla_data: slaData,
        driver_performance: driverSLAs,
        summary: {
          total_drivers: driverSLAs.length,
          average_compliance: driverSLAs.reduce((sum, d) => sum + d.compliance, 0) / driverSLAs.length,
          excellent_performers: driverSLAs.filter(d => d.status === 'excellent').length,
          critical_performers: driverSLAs.filter(d => d.status === 'critical').length
        }
      }

      // Create downloadable JSON report
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `sla-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error generating report:', error)
    }
  }

  const overallCompliance = slaData.length > 0 
    ? slaData.reduce((sum, d) => sum + d.compliance, 0) / slaData.length 
    : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SLA Compliance Reports</h1>
          <p className="text-gray-600 mt-1">
            Monitor service level agreement performance and generate automated reports
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={generateReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button variant="logistics">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Period Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Reporting Period</CardTitle>
          <CardDescription>Select the time period for SLA analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <TabsList>
              <TabsTrigger value="current_week">Current Week</TabsTrigger>
              <TabsTrigger value="last_week">Last Week</TabsTrigger>
              <TabsTrigger value="current_month">Current Month</TabsTrigger>
              <TabsTrigger value="last_month">Last Month</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Overall Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Overall Compliance</p>
                <p className="text-2xl font-bold text-gray-900">{overallCompliance.toFixed(1)}%</p>
              </div>
              <div className={`p-3 rounded-lg ${overallCompliance >= 80 ? 'bg-success-500' : 'bg-warning-500'} text-white`}>
                {overallCompliance >= 80 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
              </div>
            </div>
            <Progress value={overallCompliance} className="mt-3" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Drivers</p>
                <p className="text-2xl font-bold text-gray-900">{driverSLAs.length}</p>
              </div>
              <div className="p-3 rounded-lg bg-logistics-500 text-white">
                <Truck className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Excellent Performers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {driverSLAs.filter(d => d.status === 'excellent').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-success-500 text-white">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Need Attention</p>
                <p className="text-2xl font-bold text-gray-900">
                  {driverSLAs.filter(d => d.status === 'critical').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-danger-500 text-white">
                <AlertTriangle className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Reports */}
      <Tabs defaultValue="drivers">
        <TabsList>
          <TabsTrigger value="drivers">Driver Performance</TabsTrigger>
          <TabsTrigger value="trends">Weekly Trends</TabsTrigger>
          <TabsTrigger value="penalties">Penalties & Bonuses</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Driver SLA Performance</CardTitle>
              <CardDescription>Individual driver compliance with weekly targets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {driverSLAs.map((driver) => (
                  <div key={driver.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{driver.name}</h4>
                        <p className="text-sm text-gray-600">Truck: {driver.truck_id}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="text-sm font-medium">{driver.completed_trips}/{driver.weekly_target} trips</p>
                        <Progress value={driver.compliance} className="w-24 mt-1" />
                      </div>
                      
                      <Badge variant={getStatusColor(driver.status) as any}>
                        {driver.compliance.toFixed(0)}%
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Performance Trends</CardTitle>
              <CardDescription>Historical SLA compliance over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {slaData.map((week, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="font-semibold">{week.period}</h4>
                      <Badge variant={week.compliance >= 80 ? 'success' : 'warning'}>
                        {week.compliance.toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Target</p>
                        <p className="font-medium">{week.target} trips</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Completed</p>
                        <p className="font-medium">{week.completed} trips</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Revenue</p>
                        <p className="font-medium">{formatCurrency(week.revenue)}</p>
                      </div>
                    </div>
                    
                    <Progress value={week.compliance} />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="penalties" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Financial Impact</CardTitle>
              <CardDescription>Penalties applied for SLA non-compliance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Penalty calculations will be implemented based on contract terms</p>
                <p className="text-sm text-gray-500 mt-2">
                  Automatic penalties for consecutive SLA failures and early completion bonuses
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
