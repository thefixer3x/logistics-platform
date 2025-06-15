'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface MaintenanceQueueProps {
  supervisorId: string
}

interface Maintenance {
  id: string
  truck_id: string
  description: string
  status: string
}

export function MaintenanceQueue({ supervisorId }: MaintenanceQueueProps) {
  const [queue, setQueue] = useState<Maintenance[]>([])

  useEffect(() => {
    const fetchQueue = async () => {
      const { data } = await supabase
        .from('maintenance')
        .select('*')
        .eq('supervisor_id', supervisorId)
        .eq('status', 'pending')
      setQueue(data ?? [])
    }
    fetchQueue()
  }, [supervisorId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Maintenance Queue</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {queue.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending maintenance tasks</p>
        ) : (
          queue.map(task => (
            <div key={task.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div>
                <p className="font-medium">Truck {task.truck_id}</p>
                <p className="text-sm text-gray-600">{task.description}</p>
              </div>
              <Button size="sm" variant="outline">Mark Resolved</Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
