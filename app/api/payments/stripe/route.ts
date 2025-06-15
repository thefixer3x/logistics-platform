import Stripe from 'stripe'
import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export async function POST(request: NextRequest) {
  try {
    const { amount, currency = 'ngn', trip_id, driver_id, description } = await request.json()
    const supabase = createSupabaseServerClient()

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to smallest currency unit
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        trip_id: trip_id || '',
        driver_id: driver_id || '',
        description: description || '',
      },
    })

    // Log payment attempt in database
    await supabase
      .from('payments')
      .insert({
        trip_id,
        driver_id,
        amount,
        status: 'pending',
        payment_method: 'stripe',
        reference_number: paymentIntent.id,
        description,
      })

    return NextResponse.json({
      client_secret: paymentIntent.client_secret,
      payment_intent_id: paymentIntent.id,
    })
  } catch (error: any) {
    console.error('Payment intent creation failed:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const payment_intent_id = searchParams.get('payment_intent_id')

    if (!payment_intent_id) {
      return NextResponse.json(
        { error: 'Payment intent ID required' },
        { status: 400 }
      )
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id)

    return NextResponse.json({
      status: paymentIntent.status,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
    })
  } catch (error: any) {
    console.error('Payment retrieval failed:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
