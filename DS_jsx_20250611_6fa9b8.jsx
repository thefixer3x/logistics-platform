// components/supervisor/TruckManager.jsx
export function TruckManagement() {
  return (
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Fleet Overview</TabsTrigger>
        <TabsTrigger value="approvals">Pending Approvals (3)</TabsTrigger>
        <TabsTrigger value="incidents">Incident Reports</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <DataTable
          columns={[
            { header: "Truck ID", accessor: "id" },
            { header: "Driver", accessor: "driver" },
            { header: "Status", accessor: "status" },
            { header: "Maintenance", accessor: "maintenanceSpend" },
            { header: "Actions", cell: row => <ActionMenu truck={row} /> }
          ]}
          data={truckData}
        />
      </TabsContent>
      
      <TabsContent value="approvals">
        <ApprovalQueue approvals={pendingApprovals} />
      </TabsContent>
    </Tabs>
  );
}