'use server'

import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { createSupabaseServerClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { price_id, customer_id, metadata } = await request.json()
    const supabase = createSupabaseServerClient()

    // Get or create customer in Stripe
    let stripeCustomer

    // Check if customer already exists in our database
    const { data: existingCustomer } = await supabase
      .from('stripe_customers')
      .select('stripe_customer_id')
      .eq('user_id', customer_id)
      .single()

    if (existingCustomer?.stripe_customer_id) {
      // Customer exists, get from Stripe
      stripeCustomer = await stripe.customers.retrieve(existingCustomer.stripe_customer_id)
    } else {
      // Get user details to create a new customer
      const { data: user } = await supabase
        .from('profiles')
        .select('email, first_name, last_name, phone')
        .eq('id', customer_id)
        .single()

      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        )
      }

      // Create customer in Stripe
      stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: `${user.first_name} ${user.last_name}`,
        phone: user.phone,
        metadata: {
          user_id: customer_id
        }
      })

      // Save customer ID in our database
      await supabase
        .from('stripe_customers')
        .insert({
          user_id: customer_id,
          stripe_customer_id: stripeCustomer.id,
          created_at: new Date().toISOString()
        })
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: stripeCustomer.id,
      items: [
        { price: price_id }
      ],
      payment_behavior: 'default_incomplete',
      expand: ['latest_invoice.payment_intent'],
      metadata: {
        ...metadata,
        user_id: customer_id
      }
    })

    // Store subscription in database
    await supabase
      .from('subscriptions')
      .insert({
        user_id: customer_id,
        subscription_id: subscription.id,
        status: subscription.status,
        current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        price_id: price_id,
        metadata: metadata
      })

    // Get client secret for payment
    const invoice = subscription.latest_invoice as Stripe.Invoice
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent

    return NextResponse.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret
    })
  } catch (error: any) {
    console.error('Subscription creation failed:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
