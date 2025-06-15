'use server'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY!
const PAYSTACK_API_URL = 'https://api.paystack.co'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const reference = searchParams.get('reference')

  if (!reference) {
    return NextResponse.json(
      { error: 'Reference is required' },
      { status: 400 }
    )
  }

  try {
    const response = await fetch(`${PAYSTACK_API_URL}/transaction/verify/${reference}`, {
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (data.status) {
      // Update payment status in Supabase
      const { error: dbError } = await supabaseAdmin
        .from('payments')
        .update({
          status: data.data.status,
          gateway_response: data.data.gateway_response,
          paid_at: data.data.paid_at,
          amount: data.data.amount / 100, // Convert from kobo to naira
        })
        .eq('reference', reference)

      if (dbError) {
        console.error('Error updating payment in database:', dbError)
        // Continue anyway, as verification was successful
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error verifying Paystack payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { amount, email, metadata, currency = 'NGN', reference = null } = await request.json()

    // Validate required fields
    if (!amount || !email) {
      return NextResponse.json(
        { error: 'Amount and email are required' },
        { status: 400 }
      )
    }

    // Initialize transaction with Paystack
    const response = await fetch(`${PAYSTACK_API_URL}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: amount * 100, // Convert to kobo
        email,
        currency,
        reference,
        metadata,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/verify`,
      }),
    })

    const data = await response.json()

    if (data.status) {
      // Store the transaction in Supabase
      const { error: dbError } = await supabaseAdmin
        .from('payments')
        .insert({
          amount,
          email,
          currency,
          reference: data.data.reference,
          access_code: data.data.access_code,
          status: 'pending',
          gateway: 'paystack',
          metadata,
        })

      if (dbError) {
        console.error('Error saving payment to database:', dbError)
        // Continue anyway, as initialization was successful
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error initializing Paystack payment:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
