import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default async function DashboardPage() {
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Get user profile to determine role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, first_name, last_name')
    .eq('id', session.user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  // Redirect to appropriate dashboard based on role
  switch (profile.role) {
    case 'driver':
      redirect('/dashboard/driver')
    case 'supervisor':
      redirect('/dashboard/supervisor')
    case 'contractor':
      redirect('/dashboard/contractor')
    case 'admin':
      redirect('/dashboard/admin')
    default:
      redirect('/onboarding')
  }
}
