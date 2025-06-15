'use server'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const FLUTTERWAVE_SECRET_KEY = process.env.FLUTTERWAVE_SECRET_KEY!
const FLUTTERWAVE_API_URL = 'https://api.flutterwave.com/v3'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const transaction_id = searchParams.get('transaction_id')
  const tx_ref = searchParams.get('tx_ref')

  if (!transaction_id && !tx_ref) {
    return NextResponse.json(
      { error: 'Transaction ID or reference is required' },
      { status: 400 }
    )
  }

  try {
    let endpoint = `${FLUTTERWAVE_API_URL}/transactions`
    
    if (transaction_id) {
      endpoint = `${endpoint}/${transaction_id}/verify`
    } else if (tx_ref) {
      endpoint = `${endpoint}/verify_by_reference?tx_ref=${tx_ref}`
    }

    const response = await fetch(endpoint, {
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (data.status === 'success') {
      // Update payment status in Supabase
      const { error: dbError } = await supabaseAdmin
        .from('payments')
        .update({
          status: data.data.status,
          processor_response: data.data.processor_response,
          paid_at: new Date().toISOString(),
          amount: data.data.amount,
        })
        .eq('tx_ref', tx_ref || data.data.tx_ref)

      if (dbError) {
        console.error('Error updating payment in database:', dbError)
        // Continue anyway, as verification was successful
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error verifying Flutterwave payment:', error)
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      amount, 
      email, 
      phone_number,
      name,
      tx_ref = null,
      currency = 'NGN', 
      metadata
    } = await request.json()

    // Validate required fields
    if (!amount || !email || !name) {
      return NextResponse.json(
        { error: 'Amount, email, and name are required' },
        { status: 400 }
      )
    }

    // Generate a unique transaction reference if not provided
    const transactionRef = tx_ref || `FLW-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`

    // Initialize transaction with Flutterwave
    const response = await fetch(`${FLUTTERWAVE_API_URL}/payments`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${FLUTTERWAVE_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tx_ref: transactionRef,
        amount,
        currency,
        payment_options: 'card,bank_transfer,ussd',
        redirect_url: `${process.env.NEXT_PUBLIC_APP_URL}/payments/verify?gateway=flutterwave`,
        customer: {
          email,
          phone_number,
          name,
        },
        customizations: {
          title: 'SefTech Logistics Payment',
          description: 'Payment for logistics services',
          logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`,
        },
        meta: metadata,
      }),
    })

    const data = await response.json()

    if (data.status === 'success') {
      // Store the transaction in Supabase
      const { error: dbError } = await supabaseAdmin
        .from('payments')
        .insert({
          amount,
          email,
          currency,
          tx_ref: transactionRef,
          status: 'pending',
          gateway: 'flutterwave',
          metadata,
        })

      if (dbError) {
        console.error('Error saving payment to database:', dbError)
        // Continue anyway, as initialization was successful
      }
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error initializing Flutterwave payment:', error)
    return NextResponse.json(
      { error: 'Failed to initialize payment' },
      { status: 500 }
    )
  }
}
