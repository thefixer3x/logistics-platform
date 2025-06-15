// routes/dashboard.tsx
const DriverPortal = lazy(() => import('./components/driver/DriverPortal'));
const SupervisorView = lazy(() => import('./components/supervisor/SupervisorView'));
const ContractorDashboard = lazy(() => import('./components/contractor/ContractorDashboard'));

export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      {user.role === 'driver' && <DriverPortal />}
      {user.role === 'supervisor' && <SupervisorView />}
      {user.role === 'contractor' && <ContractorDashboard />}
    </Suspense>
  );
}