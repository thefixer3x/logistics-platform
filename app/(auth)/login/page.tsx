import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AuthForm } from '@/components/auth/AuthForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Truck, Shield, Users, BarChart3 } from 'lucide-react'

export default async function AuthPage() {
  // For server components, we can just use the supabase client directly
  const { data: { session } } = await supabase.auth.getSession()

  if (session) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-logistics-50 via-white to-logistics-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="p-3 bg-logistics-600 text-white rounded-xl">
              <Truck className="h-8 w-8" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            SefTech Logistics Platform
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive truck management system for drivers, supervisors, and contractors.
            Streamline operations, track performance, and manage contracts efficiently.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Features */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">
              Platform Features
            </h2>
            
            <div className="grid gap-4">
              <FeatureCard
                icon={<Users className="h-6 w-6" />}
                title="Driver Portal"
                description="Access trip history, track payments, request benefits, and manage daily operations"
                color="bg-success-500"
              />
              
              <FeatureCard
                icon={<Shield className="h-6 w-6" />}
                title="Supervisor Dashboard"
                description="Monitor fleet operations, approve maintenance requests, and track SLA compliance"
                color="bg-logistics-500"
              />
              
              <FeatureCard
                icon={<BarChart3 className="h-6 w-6" />}
                title="Contractor Analytics"
                description="View comprehensive reports, manage contracts, and track financial performance"
                color="bg-warning-500"
              />
            </div>
          </div>

          {/* Auth Form */}
          <div className="w-full max-w-md mx-auto">
            <Card className="shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Welcome Back</CardTitle>
                <CardDescription>
                  Sign in to access your logistics dashboard
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AuthForm />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ 
  icon, 
  title, 
  description, 
  color 
}: { 
  icon: React.ReactNode
  title: string
  description: string
  color: string
}) {
  return (
    <div className="flex items-start space-x-4 p-4 bg-white rounded-lg shadow-sm border">
      <div className={`p-2 ${color} text-white rounded-lg flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  )
}
