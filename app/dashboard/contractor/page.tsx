import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ContractorDashboard } from '@/components/dashboard/contractor/ContractorDashboard'

export default function ContractorPage() {
  return (
    <ProtectedRoute requiredRole={['contractor']}>
      <ContractorDashboard />
    </ProtectedRoute>
  )
}

  // Get contractor data and analytics
  const [
    { data: profile },
    { data: contracts },
    { data: financialSummary },
    { data: performanceMetrics }
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session?.user.id)
      .single(),
    
    supabase
      .from('contracts')
      .select(`
        *,
        contract_performance(*)
      `)
      .eq('contractor_id', session?.user.id),
    
    supabase
      .from('financial_summary')
      .select('*')
      .eq('contractor_id', session?.user.id)
      .single(),
    
    supabase
      .from('performance_analytics')
      .select('*')
      .eq('contractor_id', session?.user.id)
      .single()
  ])

  const activeContracts = contracts?.filter(c => c.status === 'active') || []
  const totalRevenue = financialSummary?.total_revenue || 0
  const monthlyRevenue = financialSummary?.monthly_revenue || 0
  const pendingPayments = financialSummary?.pending_payments || 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Contractor Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive business performance and financial insights
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="px-3 py-1">
            Contractor
          </Badge>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Active Contracts"
          value={activeContracts.length}
          icon={<FileText className="h-5 w-5" />}
          color="bg-logistics-500"
          subtitle={`${contracts?.length || 0} total contracts`}
        />
        <MetricCard
          title="Monthly Revenue"
          value={`₦${monthlyRevenue.toLocaleString()}`}
          icon={<DollarSign className="h-5 w-5" />}
          color="bg-success-500"
          subtitle="This month"
          trend="+12.5%"
        />
        <MetricCard
          title="Fleet Size"
          value={performanceMetrics?.total_trucks || 0}
          icon={<Truck className="h-5 w-5" />}
          color="bg-warning-500"
          subtitle={`${performanceMetrics?.active_trucks || 0} active`}
        />
        <MetricCard
          title="Driver Network"
          value={performanceMetrics?.total_drivers || 0}
          icon={<Users className="h-5 w-5" />}
          color="bg-purple-500"
          subtitle={`${performanceMetrics?.active_drivers || 0} active`}
        />
      </div>

      {/* Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Revenue Trends
            </CardTitle>
            <CardDescription>
              Monthly revenue performance over the last 12 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FinancialDashboard contractorId={session?.user.id} />
          </CardContent>
        </Card>

        <div className="space-y-4">
          {/* Payment Status */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Payment Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue</span>
                <span className="font-semibold">₦{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Pending Payments</span>
                <span className="font-semibold text-warning-600">
                  ₦{pendingPayments.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">This Month</span>
                <span className="font-semibold text-success-600">
                  ₦{monthlyRevenue.toLocaleString()}
                </span>
              </div>
              <Button className="w-full mt-3" size="sm">
                Process Payments
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Create New Contract
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Payment
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="contracts" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="contracts">Contracts</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="contracts">
          <ContractManagement contractorId={session?.user.id} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceAnalytics contractorId={session?.user.id} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentManagement contractorId={session?.user.id} />
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ContractOverview contractorId={session?.user.id} />
            <Card>
              <CardHeader>
                <CardTitle>SLA Compliance</CardTitle>
                <CardDescription>Service level agreement performance</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>On-Time Delivery</span>
                      <span>{performanceMetrics?.on_time_delivery || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-success-500 h-2 rounded-full" 
                        style={{ width: `${performanceMetrics?.on_time_delivery || 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Contract Compliance</span>
                      <span>{performanceMetrics?.contract_compliance || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-logistics-500 h-2 rounded-full" 
                        style={{ width: `${performanceMetrics?.contract_compliance || 0}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Driver Satisfaction</span>
                      <span>{performanceMetrics?.driver_satisfaction || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-purple-500 h-2 rounded-full" 
                        style={{ width: `${performanceMetrics?.driver_satisfaction || 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reports">
          <ReportsGeneration contractorId={session?.user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function MetricCard({ 
  title, 
  value, 
  icon, 
  color, 
  subtitle, 
  trend 
}: {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  subtitle?: string
  trend?: string
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <div className="flex items-center justify-between mt-1">
              {subtitle && (
                <p className="text-xs text-gray-500">{subtitle}</p>
              )}
              {trend && (
                <p className="text-xs text-success-600 font-medium">{trend}</p>
              )}
            </div>
          </div>
          <div className={`p-3 ${color} text-white rounded-full`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
