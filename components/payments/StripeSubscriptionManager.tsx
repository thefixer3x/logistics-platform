'use client'

import { useState } from 'react'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, CreditCard, CheckCircle2 } from 'lucide-react'
import { toast } from '@/hooks/use-toast'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

interface SubscriptionFormProps {
  priceId: string
  customerId: string
  planName: string
  amount: number
  interval: 'month' | 'year'
  metadata?: any
  onSuccess?: (subscriptionId: string) => void
  onError?: (error: string) => void
}

function SubscriptionForm({ 
  priceId, 
  customerId, 
  planName, 
  amount, 
  interval, 
  metadata = {},
  onSuccess, 
  onError 
}: SubscriptionFormProps) {
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
          return_url: `${window.location.origin}/dashboard/subscriptions/success`,
        },
      })

      if (error) {
        onError?.(error.message || 'Subscription payment failed')
        toast({
          title: 'Payment Failed',
          description: error.message,
          variant: 'destructive',
        })
      } else {
        // Payment succeeded
        onSuccess?.(priceId) // We don't have subscription ID here, will be handled on return_url
        toast({
          title: 'Subscription Activated',
          description: 'Your subscription has been processed successfully.',
          variant: 'success',
        })
      }
    } catch (error: any) {
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
          <span className="text-sm font-medium text-gray-600">Plan</span>
          <span className="text-lg font-bold text-gray-900">{planName}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">Amount</span>
          <span className="text-lg font-bold text-gray-900">
            ₦{amount.toLocaleString()}/{interval}
          </span>
        </div>
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
            Processing Subscription...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" />
            Subscribe Now
          </>
        )}
      </Button>

      <div className="text-xs text-gray-500 text-center">
        Powered by Stripe. Your payment information is secure and encrypted.
      </div>
    </form>
  )
}

interface StripeSubscriptionManagerProps {
  planId: string
  userId: string
  planName: string
  amount: number
  interval: 'month' | 'year'
  features?: string[]
  metadata?: any
  onSuccess?: (subscriptionId: string) => void
  onError?: (error: string) => void
}

export function StripeSubscriptionManager({
  planId,
  userId,
  planName,
  amount,
  interval,
  features = [],
  metadata = {},
  onSuccess,
  onError
}: StripeSubscriptionManagerProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false)

  const createSubscription = async () => {
    setIsCreatingSubscription(true)
    
    try {
      const response = await fetch('/api/payments/stripe/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          price_id: planId,
          customer_id: userId,
          metadata: {
            plan_name: planName,
            ...metadata
          }
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setClientSecret(data.clientSecret)
      } else {
        throw new Error(data.error || 'Failed to create subscription')
      }
    } catch (error: any) {
      console.error('Subscription creation error:', error)
      onError?.('Failed to initialize subscription')
      toast({
        title: 'Subscription Error',
        description: 'Failed to initialize subscription. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsCreatingSubscription(false)
    }
  }

  if (!clientSecret) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CheckCircle2 className="h-5 w-5 mr-2" />
            {planName} Plan
          </CardTitle>
          <CardDescription>
            Subscribe to the {planName} plan to unlock premium features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="font-medium">Amount</span>
            <span className="text-xl font-bold">₦{amount.toLocaleString()}/{interval}</span>
          </div>
          
          {features.length > 0 && (
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium mb-2">Features</h4>
              <ul className="space-y-2">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-4 w-4 mr-2 text-green-500" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <Badge variant="outline">Auto-Renewal</Badge>
            <Badge variant="outline">Cancel Anytime</Badge>
          </div>

          <Button 
            onClick={createSubscription}
            disabled={isCreatingSubscription}
            className="w-full"
            variant="logistics"
          >
            {isCreatingSubscription ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing Subscription...
              </>
            ) : (
              'Subscribe Now'
            )}
          </Button>
        </CardContent>
        <CardFooter className="text-xs text-gray-500 text-center">
          By subscribing, you agree to our terms of service and privacy policy.
        </CardFooter>
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
          Complete Your Subscription
        </CardTitle>
        <CardDescription>
          Enter your payment details to activate your {planName} plan
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Elements options={options} stripe={stripePromise}>
          <SubscriptionForm
            priceId={planId}
            customerId={userId}
            planName={planName}
            amount={amount}
            interval={interval}
            metadata={metadata}
            onSuccess={onSuccess}
            onError={onError}
          />
        </Elements>
      </CardContent>
    </Card>
  )
}
