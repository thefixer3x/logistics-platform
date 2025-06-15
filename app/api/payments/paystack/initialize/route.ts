'use server'

import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { amount, currency, metadata } = await request.json()
    
    // Validate the request
    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      )
    }
    
    // Get Paystack API key from environment variables
    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY
    if (!paystackSecretKey) {
      return NextResponse.json(
        { error: 'Payment provider configuration missing' },
        { status: 500 }
      )
    }
    
    // Calculate amount in kobo (Paystack requires amount in lowest currency unit)
    const amountInKobo = Math.round(amount * 100)
    
    // Generate a unique reference
    const reference = `PAY_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`
    
    // Make API request to Paystack
    const response = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        amount: amountInKobo,
        currency,
        reference,
        metadata: {
          ...metadata,
          custom_fields: [
            {
              display_name: 'SefTech Logistics',
              variable_name: 'logistics_platform',
              value: 'Logistics payment'
            }
          ]
        }
      })
    })
    
    if (!response.ok) {
      const errorData = await response.json()
      console.error('Paystack API error:', errorData)
      return NextResponse.json(
        { error: 'Payment provider error', details: errorData },
        { status: response.status }
      )
    }
    
    const paystackResponse = await response.json()
    
    // Store the payment in the database
    const { error: dbError } = await supabaseAdmin
      .from('payments.payments')
      .insert({
        provider: 'paystack',
        reference: reference,
        amount: amount,
        currency: currency,
        status: 'pending',
        metadata: metadata,
        provider_response: paystackResponse
      })
    
    if (dbError) {
      console.error('Database error storing payment:', dbError)
      // Still return success to client even if db insert fails
    }
    
    return NextResponse.json(paystackResponse)
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: 'Payment initialization failed' },
      { status: 500 }
    )
  }
}
