'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, DollarSign } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'
import { FlutterwaveService } from '@/lib/payment-services'

interface FlutterwaveButtonProps {
  amount: number
  email: string
  name: string
  phone: string
  metadata: any
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function FlutterwaveButton({ 
  amount, 
  email,
  name,
  phone,
  metadata, 
  onSuccess, 
  onError 
}: FlutterwaveButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const flutterwaveService = new FlutterwaveService(process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY || '')

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/payments/flutterwave', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          email,
          name,
          phone_number: phone,
          tx_ref: `FLW-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
          currency: 'NGN',
          metadata
        }),
      })

      const data = await response.json()

      if (data.status === 'success') {
        // Redirect to Flutterwave checkout page
        window.location.href = data.data.link
      } else {
        throw new Error(data.message || 'Failed to initialize payment')
      }
    } catch (error) {
      console.error('Flutterwave payment error:', error)
      onError?.(error instanceof Error ? error.message : 'Failed to initialize payment')
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      onClick={handlePayment}
      disabled={isLoading}
      className="w-full"
      variant="outline"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Initializing Flutterwave...
        </>
      ) : (
        <>
          <img 
            src="/flutterwave-logo.svg" 
            alt="Flutterwave" 
            className="h-4 mr-2" 
          />
          Pay with Flutterwave
        </>
      )}
    </Button>
  )
}

interface FlutterwaveManagerProps {
  amount: number
  email: string
  name: string
  phone: string
  trip_id?: string
  driver_id?: string
  description?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function FlutterwaveManager({ 
  amount, 
  email,
  name,
  phone,
  trip_id, 
  driver_id, 
  description, 
  onSuccess, 
  onError 
}: FlutterwaveManagerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <img 
            src="/flutterwave-logo.svg" 
            alt="Flutterwave" 
            className="h-5 mr-2" 
          />
          Flutterwave Payment
        </CardTitle>
        <CardDescription>
          Pay securely using Flutterwave
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium">Amount</span>
          <span className="text-xl font-bold">{formatCurrency(amount)}</span>
        </div>
        
        {description && (
          <div className="p-4 border border-gray-200 rounded-lg">
            <h4 className="font-medium mb-2">Description</h4>
            <p className="text-gray-600">{description}</p>
          </div>
        )}

        <div className="flex gap-2">
          <Badge variant="outline">Secure Payment</Badge>
          <Badge variant="outline">Multiple Options</Badge>
        </div>

        <FlutterwaveButton 
          amount={amount}
          email={email}
          name={name}
          phone={phone}
          metadata={{
            trip_id,
            driver_id,
            description
          }}
          onSuccess={onSuccess}
          onError={onError}
        />
      </CardContent>
    </Card>
  )
}
