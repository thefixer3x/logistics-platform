'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DriverStatsCardsProps {
  stats?: {
    totalTrips?: number
    completedTrips?: number
    onTimePercentage?: number
    revenue?: number
  }
}

// Temporary placeholder implementation to unblock builds. Replace with real stats UI later.
export function DriverStatsCards({ stats }: DriverStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Total Trips</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {stats?.totalTrips ?? 0}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Completed</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {stats?.completedTrips ?? 0}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>On-Time %</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          {stats?.onTimePercentage ?? 0}%
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Revenue</CardTitle>
        </CardHeader>
        <CardContent className="text-2xl font-bold">
          ₦{stats?.revenue?.toLocaleString() ?? 0}
        </CardContent>
      </Card>
    </div>
  )
}
