# Third-Party Integrations Guide

This guide explains how to use the various third-party services integrated into the SefTech Logistics Platform.

## Table of Contents
1. [Payment Gateways](#payment-gateways)
   - [Paystack](#paystack)
   - [Flutterwave](#flutterwave)
   - [Stripe](#stripe)
2. [Identity Verification](#identity-verification)
   - [Prembly](#prembly)
3. [Maps & Geolocation](#maps--geolocation)
   - [Mapbox](#mapbox)
4. [Error Tracking & Monitoring](#error-tracking--monitoring)
   - [Sentry](#sentry)

## Payment Gateways

### Paystack

Paystack is used for payment processing in Nigeria. It supports card payments, bank transfers, and USSD.

#### Implementation

```typescript
import { PaystackService } from '@/lib/payment-services';

// Initialize the service
const paystackService = new PaystackService(process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!);

// Create a payment
const createPayment = async () => {
  try {
    const response = await paystackService.createPayment(
      1000, // amount in naira
      'NGN', // currency
      { 
        user_id: 'user-123',
        trip_id: 'trip-456',
        description: 'Payment for logistics trip'
      }
    );
    
    // Handle successful payment initialization
    window.location.href = response.data.authorization_url;
  } catch (error) {
    console.error('Payment error:', error);
  }
};

// Verify a payment
const verifyPayment = async (reference) => {
  try {
    const response = await paystackService.verifyPayment(reference);
    
    if (response.data.status === 'success') {
      // Payment was successful
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
};
```

### Flutterwave

Flutterwave provides alternative payment options, including mobile money and international payments.

#### Implementation

```typescript
import { FlutterwaveService } from '@/lib/payment-services';

// Initialize the service
const flutterwaveService = new FlutterwaveService(process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!);

// Create a payment
const createPayment = async () => {
  try {
    const response = await flutterwaveService.createPayment(
      1000, // amount
      'NGN', // currency
      'user@example.com', // email
      {
        name: 'John Doe',
        phone_number: '08012345678',
        tx_ref: `FLW-${Date.now()}`
      }
    );
    
    // Handle successful payment initialization
    window.location.href = response.data.link;
  } catch (error) {
    console.error('Payment error:', error);
  }
};

// Verify a payment
const verifyPayment = async (transactionId) => {
  try {
    const response = await flutterwaveService.verifyPayment(transactionId);
    
    if (response.data.status === 'successful') {
      // Payment was successful
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Verification error:', error);
    return false;
  }
};
```

## Identity Verification

### Prembly

Prembly is used for KYC (Know Your Customer) verification, supporting BVN, NIN, and driver's license verification.

#### Implementation

```typescript
import { PremblyService } from '@/lib/verification-services';

// Initialize the service
const premblyService = new PremblyService();

// Verify BVN
const verifyBVN = async (bvn) => {
  try {
    const response = await premblyService.verifyBVN(bvn);
    
    if (response.status) {
      // BVN verification successful
      return {
        verified: true,
        data: response.data
      };
    }
    
    return {
      verified: false,
      message: response.message || 'Verification failed'
    };
  } catch (error) {
    console.error('BVN verification error:', error);
    return {
      verified: false,
      message: 'An error occurred during verification'
    };
  }
};

// Verify driver's license
const verifyDriversLicense = async (licenseNumber, userData) => {
  try {
    const response = await premblyService.verifyDriversLicense(
      licenseNumber,
      {
        first_name: userData.firstName,
        last_name: userData.lastName,
        dob: userData.dateOfBirth
      }
    );
    
    if (response.status) {
      // License verification successful
      return {
        verified: true,
        data: response.data
      };
    }
    
    return {
      verified: false,
      message: response.message || 'Verification failed'
    };
  } catch (error) {
    console.error('License verification error:', error);
    return {
      verified: false,
      message: 'An error occurred during verification'
    };
  }
};
```

## Maps & Geolocation

### Mapbox

Mapbox is used for maps, route optimization, and real-time tracking of vehicles.

#### Implementation

See the `components/dashboard/RouteOptimization.tsx` file for implementation details.

## Error Tracking & Monitoring

### Sentry

Sentry is used for error tracking and performance monitoring.

#### Implementation

The Sentry integration is already set up in the Next.js configuration. Errors are automatically captured and reported to the Sentry dashboard.

For manual error reporting:

```typescript
import * as Sentry from '@sentry/nextjs';

try {
  // Your code that might throw an error
} catch (error) {
  Sentry.captureException(error);
  // Show error UI to user
}
```
