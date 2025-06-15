'use server'

import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServerClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const webhookSecret = process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

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
      case 'customer.subscription.created':
        const subscriptionCreated = event.data.object as Stripe.Subscription
        
        await supabase
          .from('subscriptions')
          .upsert({
            subscription_id: subscriptionCreated.id,
            user_id: subscriptionCreated.metadata.user_id,
            status: subscriptionCreated.status,
            current_period_start: new Date(subscriptionCreated.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscriptionCreated.current_period_end * 1000).toISOString(),
            price_id: subscriptionCreated.items.data[0].price.id,
            cancel_at_period_end: subscriptionCreated.cancel_at_period_end,
            created_at: new Date().toISOString(),
            metadata: subscriptionCreated.metadata
          })
        
        // Create notification for user
        if (subscriptionCreated.metadata.user_id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: subscriptionCreated.metadata.user_id,
              title: 'Subscription Created',
              message: 'Your subscription has been created successfully.',
              type: 'success',
              category: 'subscription',
            })
        }
        break

      case 'customer.subscription.updated':
        const subscriptionUpdated = event.data.object as Stripe.Subscription
        
        await supabase
          .from('subscriptions')
          .update({
            status: subscriptionUpdated.status,
            current_period_start: new Date(subscriptionUpdated.current_period_start * 1000).toISOString(),
            current_period_end: new Date(subscriptionUpdated.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscriptionUpdated.cancel_at_period_end,
            updated_at: new Date().toISOString(),
          })
          .eq('subscription_id', subscriptionUpdated.id)
        break

      case 'customer.subscription.deleted':
        const subscriptionDeleted = event.data.object as Stripe.Subscription
        
        await supabase
          .from('subscriptions')
          .update({
            status: 'canceled',
            updated_at: new Date().toISOString(),
            ended_at: new Date().toISOString(),
          })
          .eq('subscription_id', subscriptionDeleted.id)
        
        // Create notification for user
        if (subscriptionDeleted.metadata.user_id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: subscriptionDeleted.metadata.user_id,
              title: 'Subscription Canceled',
              message: 'Your subscription has been canceled.',
              type: 'info',
              category: 'subscription',
            })
        }
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          // Update subscription payment status
          await supabase
            .from('subscription_invoices')
            .insert({
              subscription_id: invoice.subscription as string,
              invoice_id: invoice.id,
              amount_paid: invoice.amount_paid / 100,
              currency: invoice.currency,
              status: invoice.status,
              created_at: new Date(invoice.created * 1000).toISOString(),
              payment_intent_id: invoice.payment_intent as string,
            })
        }
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice
        
        if (failedInvoice.subscription) {
          // Update subscription payment status
          await supabase
            .from('subscription_invoices')
            .insert({
              subscription_id: failedInvoice.subscription as string,
              invoice_id: failedInvoice.id,
              amount_paid: 0,
              currency: failedInvoice.currency,
              status: 'failed',
              created_at: new Date(failedInvoice.created * 1000).toISOString(),
            })
          
          // Notify user about failed payment
          const subscription = await stripe.subscriptions.retrieve(failedInvoice.subscription as string)
          
          if (subscription.metadata.user_id) {
            await supabase
              .from('notifications')
              .insert({
                user_id: subscription.metadata.user_id,
                title: 'Payment Failed',
                message: 'Your subscription payment has failed. Please update your payment method.',
                type: 'error',
                category: 'subscription',
              })
          }
        }
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
