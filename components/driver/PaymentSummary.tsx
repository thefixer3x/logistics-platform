'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { supabase } from '@/lib/supabase'
import { DollarSign, Calendar, ArrowUpRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaymentSummaryProps {
  driverId: string
}

export function PaymentSummary({ driverId }: PaymentSummaryProps) {
  const [payments, setPayments] = useState<any[]>([])
  const [summary, setSummary] = useState({
    totalEarnings: 0,
    pendingPayments: 0,
    lastPaymentDate: ''
  })
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    async function fetchPayments() {
      if (!driverId) return

      try {
        const { data, error } = await supabase
          .from('driver_payments')
          .select('*')
          .eq('driver_id', driverId)
          .order('payment_date', { ascending: false })
          .limit(5)

        if (error) {
          console.error('Error fetching payments:', error)
          return
        }

        setPayments(data || [])

        // Calculate summary stats
        const total = data?.reduce((acc, payment) => acc + payment.amount, 0) || 0
        const pending = data?.filter(p => p.status === 'pending')
                            .reduce((acc, payment) => acc + payment.amount, 0) || 0
        const lastDate = data?.[0]?.payment_date || ''

        setSummary({
          totalEarnings: total,
          pendingPayments: pending,
          lastPaymentDate: lastDate ? new Date(lastDate).toLocaleDateString() : 'N/A'
        })
      } catch (error) {
        console.error('Failed to fetch payments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPayments()
  }, [driverId])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  if (loading) {
    return <div className="flex justify-center py-10">Loading payment information...</div>
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.totalEarnings)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-full text-green-600">
                <DollarSign className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(summary.pendingPayments)}</p>
              </div>
              <div className="p-2 bg-amber-100 rounded-full text-amber-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Last Payment</p>
                <p className="text-2xl font-bold text-gray-900">{summary.lastPaymentDate}</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-full text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Payments</CardTitle>
          <CardDescription>Your recent payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          {payments.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <DollarSign className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No payment history found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {payments.map((payment) => (
                <div 
                  key={payment.id} 
                  className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <div className="font-medium">Payment #{payment.reference_id}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(payment.payment_date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="font-medium text-right">
                      {formatCurrency(payment.amount)}
                    </div>
                    <span className={`ml-2 inline-block w-3 h-3 rounded-full ${
                      payment.status === 'completed' ? 'bg-green-500' : 
                      payment.status === 'pending' ? 'bg-amber-500' : 'bg-red-500'
                    }`}></span>
                  </div>
                </div>
              ))}
              
              <Button variant="outline" className="w-full" size="sm">
                <span>View All Transactions</span>
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
