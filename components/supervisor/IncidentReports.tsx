'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface IncidentReportsProps {
  supervisorId: string
}

interface Incident {
  id: string
  type: string
  description: string
  driver_name: string
}

export function IncidentReports({ supervisorId }: IncidentReportsProps) {
  const [incidents, setIncidents] = useState<Incident[]>([])

  useEffect(() => {
    const fetchIncidents = async () => {
      const { data } = await supabase
        .from('incidents')
        .select('*')
        .eq('supervisor_id', supervisorId)
        .eq('status', 'open')
      setIncidents(data ?? [])
    }
    fetchIncidents()
  }, [supervisorId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Incident Reports</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {incidents.length === 0 ? (
          <p className="text-gray-500 text-sm">No active incidents</p>
        ) : (
          incidents.map(incident => (
            <div key={incident.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div>
                <p className="font-medium">{incident.type}</p>
                <p className="text-sm text-gray-600">{incident.description}</p>
                <p className="text-xs text-gray-500">Driver: {incident.driver_name}</p>
              </div>
              <Button size="sm" variant="outline">Investigate</Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
