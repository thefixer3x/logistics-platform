'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, DollarSign } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'
import { PaystackService } from '@/lib/payment-services'

interface PaystackButtonProps {
  amount: number
  email: string
  metadata: any
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaystackButton({ 
  amount, 
  email, 
  metadata, 
  onSuccess, 
  onError 
}: PaystackButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const paystackService = new PaystackService(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '')

  const handlePayment = async () => {
    setIsLoading(true)
    
    try {
      const response = await paystackService.createPayment(
        amount, 
        'NGN', 
        { 
          email,
          ...metadata 
        }
      )

      if (response.status) {
        // Redirect to Paystack checkout page
        window.location.href = response.data.authorization_url
      } else {
        throw new Error(response.message || 'Failed to initialize payment')
      }
    } catch (error) {
      console.error('Paystack payment error:', error)
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
          Initializing Paystack...
        </>
      ) : (
        <>
          <img 
            src="/paystack-logo.svg" 
            alt="Paystack" 
            className="h-4 mr-2" 
          />
          Pay with Paystack
        </>
      )}
    </Button>
  )
}

interface PaystackManagerProps {
  amount: number
  email: string
  trip_id?: string
  driver_id?: string
  description?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaystackManager({ 
  amount, 
  email,
  trip_id, 
  driver_id, 
  description, 
  onSuccess, 
  onError 
}: PaystackManagerProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <img 
            src="/paystack-logo.svg" 
            alt="Paystack" 
            className="h-5 mr-2" 
          />
          Paystack Payment
        </CardTitle>
        <CardDescription>
          Pay securely using Paystack
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
          <Badge variant="outline">PCI Compliant</Badge>
        </div>

        <PaystackButton 
          amount={amount}
          email={email}
          metadata={{
            trip_id,
            driver_id,
            description,
            custom_fields: [
              {
                display_name: "Trip ID",
                variable_name: "trip_id",
                value: trip_id
              }
            ]
          }}
          onSuccess={onSuccess}
          onError={onError}
        />
      </CardContent>
    </Card>
  )
}
