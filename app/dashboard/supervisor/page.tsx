import { supabase } from '@/lib/supabase'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Users, 
  Truck, 
  AlertTriangle, 
  CheckCircle2,
  Clock,
  DollarSign,
  Settings,
  FileText
} from 'lucide-react'
import { FleetOverview } from '@/components/supervisor/FleetOverview'
import { PendingApprovals } from '@/components/supervisor/PendingApprovals'
import { IncidentReports } from '@/components/supervisor/IncidentReports'
import { DriverManagement } from '@/components/supervisor/DriverManagement'
import { MaintenanceQueue } from '@/components/supervisor/MaintenanceQueue'
import { PerformanceMetrics } from '@/components/supervisor/PerformanceMetrics'

export default async function SupervisorDashboard() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Get supervisor data and fleet statistics
  const [
    { data: profile },
    { data: fleetStats },
    { data: pendingApprovals },
    { data: activeIncidents }
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('*')
      .eq('id', session?.user.id)
      .single(),
    
    supabase
      .from('fleet_statistics')
      .select('*')
      .eq('supervisor_id', session?.user.id)
      .single(),
    
    supabase
      .from('approval_requests')
      .select('*')
      .eq('supervisor_id', session?.user.id)
      .eq('status', 'pending')
      .limit(10),
    
    supabase
      .from('incidents')
      .select('*')
      .eq('supervisor_id', session?.user.id)
      .eq('status', 'open')
      .limit(5)
  ])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Operations Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Manage fleet operations and monitor performance
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="outline" className="px-3 py-1">
            Supervisor
          </Badge>
          <Button size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Active Drivers"
          value={fleetStats?.active_drivers || 0}
          icon={<Users className="h-5 w-5" />}
          color="bg-success-500"
          change="+2 this week"
        />
        <StatsCard
          title="Fleet Vehicles"
          value={fleetStats?.total_trucks || 0}
          icon={<Truck className="h-5 w-5" />}
          color="bg-logistics-500"
          change="3 in maintenance"
        />
        <StatsCard
          title="Pending Approvals"
          value={pendingApprovals?.length || 0}
          icon={<Clock className="h-5 w-5" />}
          color="bg-warning-500"
          urgent={pendingApprovals?.length > 0}
        />
        <StatsCard
          title="Active Incidents"
          value={activeIncidents?.length || 0}
          icon={<AlertTriangle className="h-5 w-5" />}
          color="bg-danger-500"
          urgent={activeIncidents?.length > 0}
        />
      </div>

      {/* Urgent Actions */}
      {(pendingApprovals?.length > 0 || activeIncidents?.length > 0) && (
        <Card className="border-warning-200 bg-warning-50">
          <CardHeader>
            <CardTitle className="flex items-center text-warning-800">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Urgent Actions Required
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {pendingApprovals?.map(approval => (
                <div key={approval.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <div>
                    <p className="font-medium">{approval.type}: {approval.description}</p>
                    <p className="text-sm text-gray-600">Amount: ₦{approval.amount?.toLocaleString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Review</Button>
                  </div>
                </div>
              ))}
              {activeIncidents?.map(incident => (
                <div key={incident.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <div>
                    <p className="font-medium">{incident.type}: {incident.description}</p>
                    <p className="text-sm text-gray-600">Driver: {incident.driver_name}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline">Investigate</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Dashboard Tabs */}
      <Tabs defaultValue="fleet" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="fleet">Fleet</TabsTrigger>
          <TabsTrigger value="drivers">Drivers</TabsTrigger>
          <TabsTrigger value="approvals">Approvals</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="incidents">Incidents</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="fleet">
          <FleetOverview supervisorId={session?.user.id} />
        </TabsContent>

        <TabsContent value="drivers">
          <DriverManagement supervisorId={session?.user.id} />
        </TabsContent>

        <TabsContent value="approvals">
          <PendingApprovals supervisorId={session?.user.id} />
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceQueue supervisorId={session?.user.id} />
        </TabsContent>

        <TabsContent value="incidents">
          <IncidentReports supervisorId={session?.user.id} />
        </TabsContent>

        <TabsContent value="reports">
          <PerformanceMetrics supervisorId={session?.user.id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatsCard({ 
  title, 
  value, 
  icon, 
  color, 
  change, 
  urgent = false 
}: {
  title: string
  value: number
  icon: React.ReactNode
  color: string
  change?: string
  urgent?: boolean
}) {
  return (
    <Card className={urgent ? 'border-danger-200 bg-danger-50' : ''}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            {change && (
              <p className="text-xs text-gray-500 mt-1">{change}</p>
            )}
          </div>
          <div className={`p-3 ${color} text-white rounded-full`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
