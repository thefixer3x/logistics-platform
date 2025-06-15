'use server'

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

const PREMBLY_APP_ID = process.env.PREMBLY_APP_ID!
const PREMBLY_X_API_KEY = process.env.PREMBLY_X_API_KEY!
const PREMBLY_API_URL = 'https://api.prembly.com/identitypass/v1'

// Verify BVN (Bank Verification Number)
export async function POST(request: NextRequest) {
  try {
    const { verificationType, data, user_id } = await request.json()

    if (!verificationType || !data || !user_id) {
      return NextResponse.json(
        { error: 'Verification type, data, and user ID are required' },
        { status: 400 }
      )
    }

    let endpoint = '';
    let requestBody = {
      verification_type: verificationType,
      ...data
    };

    // Choose the appropriate endpoint based on verification type
    switch (verificationType) {
      case 'bvn':
        endpoint = `${PREMBLY_API_URL}/verifications/bvn`;
        break;
      case 'nin':
        endpoint = `${PREMBLY_API_URL}/verifications/nin-slip`;
        break;
      case 'drivers_license':
        endpoint = `${PREMBLY_API_URL}/verifications/drivers-license`;
        break;
      case 'vehicle':
        endpoint = `${PREMBLY_API_URL}/verifications/vehicle`;
        break;
      case 'tin':
        endpoint = `${PREMBLY_API_URL}/verifications/tin`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid verification type' },
          { status: 400 }
        );
    }

    // Make API call to Prembly
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'x-api-key': PREMBLY_X_API_KEY,
        'app-id': PREMBLY_APP_ID,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })

    const result = await response.json()

    // Store verification result in Supabase
    const { error: dbError } = await supabaseAdmin
      .from('user_verifications')
      .insert({
        user_id,
        verification_type: verificationType,
        status: result.status ? 'verified' : 'failed',
        details: result,
        verified_at: result.status ? new Date().toISOString() : null,
      })

    if (dbError) {
      console.error('Error saving verification to database:', dbError)
    }

    // If verification was successful, update user's verified status
    if (result.status) {
      const { error: userUpdateError } = await supabaseAdmin
        .from('profiles')
        .update({
          is_verified: true,
          verification_level: verificationType === 'bvn' ? 2 : 1,
          verified_at: new Date().toISOString(),
        })
        .eq('id', user_id)

      if (userUpdateError) {
        console.error('Error updating user verification status:', userUpdateError)
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error during identity verification:', error)
    return NextResponse.json(
      { error: 'Failed to complete verification' },
      { status: 500 }
    )
  }
}
