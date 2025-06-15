// components/contractor/PerformanceCard.jsx
export function ContractorPerformance() {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-bold">Operational Analytics</h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <StatCard title="Active Trucks" value={8} delta="+2" />
          <StatCard title="Weekly Spend" value="₦2,450,000" />
          <StatCard title="SLA Compliance" value="92%" />
        </div>
        <ProgressChart 
          data={[
            { week: 'W1', target: 12, actual: 10 },
            { week: 'W2', target: 12, actual: 12 },
            { week: 'W3', target: 12, actual: 11 }
          ]} 
        />
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Generate Report</Button>
        <Button>Request Payment</Button>
      </CardFooter>
    </Card>
  );
}