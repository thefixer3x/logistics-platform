'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface PerformanceMetricsProps {
  supervisorId: string
}

export function PerformanceMetrics({ supervisorId }: PerformanceMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500">
          Detailed performance analytics will appear here.
        </p>
      </CardContent>
    </Card>
  )
}
