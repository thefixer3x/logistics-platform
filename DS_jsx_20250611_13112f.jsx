// lib/truckData.js
export async function fetchTruckData() {
  const { data, error } = await supabase
    .from('truck_operations')
    .select(`
      id,
      status,
      driver:drivers(name, status),
      weekly_target,
      completed_trips,
      maintenance:maintenance_logs(sum)
    `)
    .eq('contractor_id', user.contractorId);
  
  return optimizeTruckData(data);
}