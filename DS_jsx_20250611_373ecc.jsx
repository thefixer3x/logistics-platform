// components/driver/DashboardCard.jsx
export function DriverSummaryCard({ driver }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold">{driver.name}</h3>
        <Badge variant={driver.status === 'Active' ? 'success' : 'warning'}>
          {driver.status}
        </Badge>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <StatItem label="Pending Payments" value={`₦${driver.pendingPay.toLocaleString()}`} />
        <StatItem label="Feeding Allowance" value={`₦${driver.feedingDue.toLocaleString()}`} />
        <StatItem label="Completed Trips" value={driver.completedTrips} />
        <StatItem label="SLA Rating" value={<Progress value={driver.slaRating} />} />
      </CardContent>
      <CardFooter>
        <Button size="sm">View Trip History</Button>
        <Button size="sm" variant="secondary">
          Request Benefits
        </Button>
      </CardFooter>
    </Card>
  );
}