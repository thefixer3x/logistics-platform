import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { DashboardSidebar } from '@/components/layout/DashboardSidebar'
import { DashboardHeader } from '@/components/layout/DashboardHeader'
import { MobileNav } from '@/components/layout/MobileNav'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ConnectionStatusHandler } from '@/components/ConnectionStatusHandler'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <DashboardSidebar />
        <div className="lg:pl-64">
          <DashboardHeader />
          <MobileNav />
          <main className="p-4 sm:p-6 lg:p-8">
            <ErrorBoundary>
              <ConnectionStatusHandler>
                {children}
              </ConnectionStatusHandler>
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
