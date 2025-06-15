'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { UnifiedPaymentGateway } from '@/components/payments/UnifiedPaymentGateway'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ConnectionStatusHandler } from '@/components/ConnectionStatusHandler'
import { toast } from '@/hooks/use-toast'

export default function PaymentTestPage() {
  const [amount, setAmount] = useState(1000)
  const [description, setDescription] = useState('Test payment')
  const [showPayment, setShowPayment] = useState(false)
  
  const handlePaymentSuccess = () => {
    toast({
      title: 'Payment Successful',
      description: 'Your test payment has been processed successfully.',
      variant: 'success'
    })
    setShowPayment(false)
  }
  
  const handlePaymentError = (error: string) => {
    toast({
      title: 'Payment Failed',
      description: error || 'An error occurred during payment processing.',
      variant: 'destructive'
    })
  }

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">Payment Gateway Test</h1>
        
        <ErrorBoundary>
          <ConnectionStatusHandler>
            <div className="grid gap-6">
              {!showPayment ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Test Payment</CardTitle>
                    <CardDescription>
                      Configure a test payment to try our payment gateways
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      setShowPayment(true)
                    }} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="amount">Amount (NGN)</Label>
                        <Input
                          id="amount"
                          type="number"
                          min="100"
                          value={amount}
                          onChange={(e) => setAmount(Number(e.target.value))}
                          required
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="description">Payment Description</Label>
                        <Input
                          id="description"
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          required
                        />
                      </div>
                      
                      <Button type="submit" className="w-full">
                        Proceed to Payment
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowPayment(false)}
                    className="mb-4"
                  >
                    ← Back to Configuration
                  </Button>
                  
                  <UnifiedPaymentGateway
                    amount={amount}
                    description={description}
                    trip_id="test-trip-123"
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </div>
              )}
              
              <Card>
                <CardHeader>
                  <CardTitle>About Payment Testing</CardTitle>
                  <CardDescription>
                    Information about test payments
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      This page allows you to test our integrated payment gateways with test credentials.
                      No real charges will be made during testing.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium mb-2">Paystack</h3>
                        <p className="text-xs text-gray-600">
                          Test card: 5060 6666 6666 6666<br />
                          Expiry: Any future date<br />
                          CVV: Any 3 digits<br />
                          PIN: 1234
                        </p>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium mb-2">Flutterwave</h3>
                        <p className="text-xs text-gray-600">
                          Test card: 5531 8866 5214 2950<br />
                          Expiry: Any future date<br />
                          CVV: Any 3 digits<br />
                          PIN: 3310
                        </p>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium mb-2">Stripe</h3>
                        <p className="text-xs text-gray-600">
                          Test card: 4242 4242 4242 4242<br />
                          Expiry: Any future date<br />
                          CVV: Any 3 digits<br />
                          ZIP: Any 5 digits
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ConnectionStatusHandler>
        </ErrorBoundary>
      </div>
    </ProtectedRoute>
  )
}
