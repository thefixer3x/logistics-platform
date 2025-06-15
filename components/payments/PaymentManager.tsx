'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, DollarSign } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { formatCurrency } from '@/lib/utils'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface PaymentFormProps {
  amount: number
  trip_id?: string
  driver_id?: string
  description?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

function PaymentForm({ amount, trip_id, driver_id, description, onSuccess, onError }: PaymentFormProps) {
  const stripe = useStripe()
  const elements = useElements()
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return
    }

    setIsLoading(true)

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/payments/success`,
        },
      })

      if (error) {
        onError?.(error.message || 'Payment failed')
        toast({
          title: 'Payment Failed',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        onSuccess?.()
        toast({
          title: 'Payment Successful',
          description: 'Your payment has been processed successfully.',
          variant: 'success',
        })
      }
    } catch (error) {
      onError?.('An unexpected error occurred')
      toast({
        title: 'Error',
        description: 'An unexpected error occurred during payment.',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Amount to Pay</span>
          <span className="text-2xl font-bold text-gray-900">
            {formatCurrency(amount)}
          </span>
        </div>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </div>

      <PaymentElement />

      <Button 
        type="submit" 
        disabled={!stripe || isLoading}
        className="w-full"
        variant="logistics"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing Payment...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Pay {formatCurrency(amount)}
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        Powered by Stripe. Your payment information is secure and encrypted.
      </div>
    </form>
  )
}

interface PaymentManagerProps {
  amount: number
  trip_id?: string
  driver_id?: string
  description?: string
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function PaymentManager({ 
  amount, 
  trip_id, 
  driver_id, 
  description, 
  onSuccess, 
  onError 
}: PaymentManagerProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isCreatingIntent, setIsCreatingIntent] = useState(false)

  const createPaymentIntent = async () => {
    setIsCreatingIntent(true)
    
    try {
      const response = await fetch('/api/payments/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'ngn',
          trip_id,
          driver_id,
          description,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setClientSecret(data.client_secret)
      } else {
        throw new Error(data.error || 'Failed to create payment intent')
      }
    } catch (error) {
      console.error('Payment intent creation error:', error)
      onError?.('Failed to initialize payment')
      toast({
        title: 'Payment Error',
        description: 'Failed to initialize payment. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsCreatingIntent(false)
    }
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="h-5 w-5 mr-2" />
            Payment Details
          </CardTitle>
          <CardDescription>
            Review your payment information before proceeding
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
            <Badge variant="outline">256-bit SSL</Badge>
          </div>

          <Button 
            onClick={createPaymentIntent}
            disabled={isCreatingIntent}
            className="w-full"
            variant="logistics"
          >
            {isCreatingIntent ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing Payment...
              </>
            ) : (
              'Proceed to Payment'
            )}
          </Button>
        </CardContent>
      </Card>
    )
  }

  const appearance = {
    theme: 'stripe' as const,
    variables: {
      colorPrimary: '#0ea5e9',
    },
  }

  const options = {
    clientSecret,
    appearance,
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CreditCard className="h-5 w-5 mr-2" />
          Payment Information
        </CardTitle>
        <CardDescription>
          Enter your payment details to complete the transaction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements options={options} stripe={stripePromise}>
          <PaymentForm
            amount={amount}
            trip_id={trip_id}
            driver_id={driver_id}
            description={description}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </CardContent>
    </Card>
  )
}
