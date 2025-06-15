import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ContractorDashboard } from '@/components/dashboard/contractor/ContractorDashboard'

export default function ContractorPage() {
  return (
    <ProtectedRoute requiredRole={['contractor']}>
      <ContractorDashboard />
    </ProtectedRoute>
  )
}
