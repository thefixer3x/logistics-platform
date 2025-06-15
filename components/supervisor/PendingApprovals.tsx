'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase'

interface PendingApprovalsProps {
  supervisorId: string
}

interface Approval {
  id: string
  type: string
  description: string
  amount?: number
}

export function PendingApprovals({ supervisorId }: PendingApprovalsProps) {
  const [approvals, setApprovals] = useState<Approval[]>([])

  useEffect(() => {
    const fetchApprovals = async () => {
      const { data } = await supabase
        .from('approval_requests')
        .select('*')
        .eq('supervisor_id', supervisorId)
        .eq('status', 'pending')
      setApprovals(data ?? [])
    }
    fetchApprovals()
  }, [supervisorId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Approvals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {approvals.length === 0 ? (
          <p className="text-gray-500 text-sm">No pending approvals</p>
        ) : (
          approvals.map(approval => (
            <div key={approval.id} className="flex items-center justify-between bg-gray-50 p-2 rounded">
              <div>
                <p className="font-medium">{approval.type}</p>
                <p className="text-sm text-gray-600">{approval.description}</p>
              </div>
              <Button size="sm" variant="outline">Review</Button>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}
