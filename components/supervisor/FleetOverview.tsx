'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'

interface FleetOverviewProps {
  supervisorId: string
}

// Minimal placeholder – replace with real charts/statistics later
export function FleetOverview({ supervisorId }: FleetOverviewProps) {
  const [vehicleCount, setVehicleCount] = useState<number>(0)
  const [activeVehicles, setActiveVehicles] = useState<number>(0)

  useEffect(() => {
    // Fetch basic fleet stats (placeholder)
    const fetchStats = async () => {
      const { data } = await supabase
        .from('trucks')
        .select('id, status')
        .eq('supervisor_id', supervisorId)

      if (data) {
        setVehicleCount(data.length)
        setActiveVehicles(data.filter(t => t.status === 'active').length)
      }
    }
    fetchStats()
  }, [supervisorId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Fleet Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>Total Vehicles: <span className="font-semibold">{vehicleCount}</span></p>
        <p>Active: <span className="font-semibold text-green-600">{activeVehicles}</span></p>
      </CardContent>
    </Card>
  )
}
