'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PaymentManager } from './PaymentManager'
import { PaystackManager } from './PaystackManager'
import { FlutterwaveManager } from './FlutterwaveManager'
import { useAuth } from '@/contexts/AuthContext'

interface UnifiedPaymentProps {
  amount: number
  trip_id?: string
  driver_id?: string
  description?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function UnifiedPaymentGateway({
  amount,
  trip_id,
  driver_id,
  description,
  onSuccess,
  onError
}: UnifiedPaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'paystack' | 'flutterwave'>('paystack')
  const { user, profile } = useAuth()

  if (!user || !profile) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-gray-500">
            Please log in to make a payment
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Method</CardTitle>
        <CardDescription>
          Choose your preferred payment method
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="paystack">Paystack</TabsTrigger>
            <TabsTrigger value="flutterwave">Flutterwave</TabsTrigger>
            <TabsTrigger value="stripe">Stripe</TabsTrigger>
          </TabsList>
          
          <TabsContent value="paystack">
            <PaystackManager
              amount={amount}
              email={user.email || ''}
              trip_id={trip_id}
              driver_id={driver_id}
              description={description}
              onSuccess={onSuccess}
              onError={onError}
            />
          </TabsContent>
          
          <TabsContent value="flutterwave">
            <FlutterwaveManager
              amount={amount}
              email={user.email || ''}
              name={`${profile.first_name} ${profile.last_name}`}
              phone={profile.phone || ''}
              trip_id={trip_id}
              driver_id={driver_id}
              description={description}
              onSuccess={onSuccess}
              onError={onError}
            />
          </TabsContent>
          
          <TabsContent value="stripe">
            <PaymentManager
              amount={amount}
              trip_id={trip_id}
              driver_id={driver_id}
              description={description}
              onSuccess={onSuccess}
              onError={onError}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
