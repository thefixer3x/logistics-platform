import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServerClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Webhook signature verification failed' },
      { status: 400 }
    )
  }

  const supabase = createSupabaseServerClient()

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        
        // Update payment status in database
        await supabase
          .from('payments')
          .update({
            status: 'completed',
            paid_at: new Date().toISOString(),
          })
          .eq('reference_number', paymentIntent.id)

        // Update trip payment status if trip_id exists
        if (paymentIntent.metadata.trip_id) {
          await supabase
            .from('trips')
            .update({
              payment_status: 'paid',
            })
            .eq('id', paymentIntent.metadata.trip_id)
        }

        // Create notification for driver
        if (paymentIntent.metadata.driver_id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: paymentIntent.metadata.driver_id,
              title: 'Payment Received',
              message: `Payment of ₦${(paymentIntent.amount / 100).toLocaleString()} has been processed successfully.`,
              type: 'success',
              category: 'payment',
            })
        }
        break

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent
        
        await supabase
          .from('payments')
          .update({
            status: 'failed',
          })
          .eq('reference_number', failedPayment.id)

        // Create notification for failed payment
        if (failedPayment.metadata.driver_id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: failedPayment.metadata.driver_id,
              title: 'Payment Failed',
              message: `Payment of ₦${(failedPayment.amount / 100).toLocaleString()} failed. Please contact support.`,
              type: 'error',
              category: 'payment',
            })
        }
        break

      case 'payment_intent.canceled':
        const canceledPayment = event.data.object as Stripe.PaymentIntent
        
        await supabase
          .from('payments')
          .update({
            status: 'failed',
          })
          .eq('reference_number', canceledPayment.id)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
