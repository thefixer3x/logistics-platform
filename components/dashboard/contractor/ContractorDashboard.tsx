'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  DollarSign, 
  TrendingUp, 
  FileText, 
  Users,
  Truck,
  Calendar,
  AlertCircle,
  CheckCircle,
  Download,
  Plus,
  BarChart3
} from 'lucide-react'
import { formatCurrency, formatDate } from '@/lib/utils'

interface ContractorStats {
  totalRevenue: number
  monthlyRevenue: number
  activeContracts: number
  totalDrivers: number
  completedTrips: number
  avgSLA: number
  pendingPayments: number
  maintenanceCosts: number
}

export function ContractorDashboard() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<ContractorStats>({
    totalRevenue: 45000000,
    monthlyRevenue: 8500000,
    activeContracts: 12,
    totalDrivers: 85,
    completedTrips: 1247,
    avgSLA: 94,
    pendingPayments: 2800000,
    maintenanceCosts: 1200000
  })

  const [recentContracts] = useState([
    {
      id: 'CTR-2025-001',
      client: 'Lagos State Infrastructure',
      value: 15000000,
      status: 'active',
      progress: 65,
      deadline: '2025-08-15'
    },
    {
      id: 'CTR-2025-002',
      client: 'Federal Road Construction',
      value: 22000000,
      status: 'active',
      progress: 42,
      deadline: '2025-09-30'
    },
    {
      id: 'CTR-2025-003',
      client: 'Urban Development Corp',
      value: 8000000,
      status: 'pending',
      progress: 0,
      deadline: '2025-07-20'
    }
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Contractor Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {profile?.first_name}. Manage your contracts and track financial performance.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
          <Button variant="logistics">
            <Plus className="h-4 w-4 mr-2" />
            New Contract
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FinancialCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          subtitle="This year"
          icon={<DollarSign className="h-5 w-5" />}
          trend="+12% from last year"
          color="success"
        />
        
        <FinancialCard
          title="Monthly Revenue"
          value={formatCurrency(stats.monthlyRevenue)}
          subtitle="Current month"
          icon={<TrendingUp className="h-5 w-5" />}
          trend="+8% from last month"
          color="logistics"
        />
        
        <FinancialCard
          title="Pending Payments"
          value={formatCurrency(stats.pendingPayments)}
          subtitle="Outstanding"
          icon={<AlertCircle className="h-5 w-5" />}
          trend="3 invoices pending"
          color="warning"
        />
        
        <FinancialCard
          title="Active Contracts"
          value={stats.activeContracts.toString()}
          subtitle="In progress"
          icon={<FileText className="h-5 w-5" />}
          trend="2 expiring soon"
          color="logistics"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contracts Overview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Contract Management
              </CardTitle>
              <CardDescription>
                Monitor progress and manage active contracts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="active">
                <TabsList>
                  <TabsTrigger value="active">Active Contracts</TabsTrigger>
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="completed">Completed</TabsTrigger>
                </TabsList>
                
                <TabsContent value="active" className="mt-4">
                  <div className="space-y-4">
                    {recentContracts.filter(c => c.status === 'active').map((contract) => (
                      <div key={contract.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{contract.client}</h4>
                            <p className="text-sm text-gray-600">{contract.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-logistics-600">
                              {formatCurrency(contract.value)}
                            </p>
                            <Badge variant="success">Active</Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center text-sm">
                            <span>Progress</span>
                            <span>{contract.progress}%</span>
                          </div>
                          <Progress value={contract.progress} />
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>Deadline: {formatDate(contract.deadline)}</span>
                            <Button size="sm" variant="outline">View Details</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="pending" className="mt-4">
                  <div className="space-y-4">
                    {recentContracts.filter(c => c.status === 'pending').map((contract) => (
                      <div key={contract.id} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{contract.client}</h4>
                            <p className="text-sm text-gray-600">{contract.id}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-warning-600">
                              {formatCurrency(contract.value)}
                            </p>
                            <Badge variant="warning">Pending</Badge>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">
                            Expected Start: {formatDate(contract.deadline)}
                          </span>
                          <Button size="sm" variant="outline">Review</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Performance Metrics & Quick Stats */}
        <div className="space-y-6">
          {/* Performance Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="h-5 w-5 mr-2" />
                Performance Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">SLA Compliance</span>
                  <span className="text-sm font-bold">{stats.avgSLA}%</span>
                </div>
                <Progress value={stats.avgSLA} />
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-success-50 rounded-lg">
                    <p className="text-lg font-bold text-success-600">{stats.completedTrips}</p>
                    <p className="text-xs text-success-700">Completed Trips</p>
                  </div>
                  <div className="text-center p-3 bg-logistics-50 rounded-lg">
                    <p className="text-lg font-bold text-logistics-600">{stats.totalDrivers}</p>
                    <p className="text-xs text-logistics-700">Active Drivers</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Create New Contract
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <DollarSign className="h-4 w-4 mr-2" />
                Payment Management
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Driver Performance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <BarChart3 className="h-4 w-4 mr-2" />
                Financial Reports
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-success-100 rounded-full">
                    <CheckCircle className="h-3 w-3 text-success-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Payment received</p>
                    <p className="text-xs text-gray-600">₦2,500,000 from Lagos State</p>
                    <p className="text-xs text-gray-400">2 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-logistics-100 rounded-full">
                    <FileText className="h-3 w-3 text-logistics-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Contract milestone reached</p>
                    <p className="text-xs text-gray-600">Federal Road Project - 50% complete</p>
                    <p className="text-xs text-gray-400">5 hours ago</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="p-1 bg-warning-100 rounded-full">
                    <AlertCircle className="h-3 w-3 text-warning-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Maintenance cost exceeded</p>
                    <p className="text-xs text-gray-600">TRK-045 - Review required</p>
                    <p className="text-xs text-gray-400">8 hours ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function FinancialCard({ 
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
