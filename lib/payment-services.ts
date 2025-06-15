'use client'

import { useState } from 'react'
import { useErrorHandler } from '@/hooks/use-error-handler'

// Interface for all payment service providers
export interface PaymentProvider {
  name: string;
  slug: string;
  createPayment: (amount: number, currency: string, metadata: any) => Promise<any>;
  verifyPayment: (reference: string) => Promise<any>;
  createSubscription?: (planId: string, customerId: string, metadata: any) => Promise<any>;
}

// Interface for identity verification providers
export interface VerificationProvider {
  name: string;
  slug: string;
  verifyIdentity: (data: any) => Promise<any>;
  verifyBVN?: (bvn: string) => Promise<any>;
  verifyDriversLicense?: (licenseNumber: string, data: any) => Promise<any>;
}

// PayStack Implementation
export class PaystackService implements PaymentProvider {
  name = 'Paystack';
  slug = 'paystack';
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async createPayment(amount: number, currency = 'NGN', metadata: any) {
    try {
      const response = await fetch('/api/payments/paystack/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency, metadata }),
      });
      
      if (!response.ok) {
        throw new Error(`Payment initialization failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Paystack payment error:', error);
      throw error;
    }
  }
  
  async verifyPayment(reference: string) {
    try {
      const response = await fetch(`/api/payments/paystack/verify?reference=${reference}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Payment verification failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Paystack verification error:', error);
      throw error;
    }
  }
  
  async createSubscription(planId: string, customerId: string, metadata: any) {
    try {
      const response = await fetch('/api/payments/paystack/subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plan: planId, customer: customerId, metadata }),
      });
      
      if (!response.ok) {
        throw new Error(`Subscription creation failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Paystack subscription error:', error);
      throw error;
    }
  }
}

// Flutterwave Implementation
export class FlutterwaveService implements PaymentProvider {
  name = 'Flutterwave';
  slug = 'flutterwave';
  private publicKey: string;
  
  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }
  
  async createPayment(amount: number, currency = 'NGN', metadata: any) {
    try {
      const response = await fetch('/api/payments/flutterwave/initialize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount, currency, metadata }),
      });
      
      if (!response.ok) {
        throw new Error(`Payment initialization failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Flutterwave payment error:', error);
      throw error;
    }
  }
  
  async verifyPayment(transactionId: string) {
    try {
      const response = await fetch(`/api/payments/flutterwave/verify?id=${transactionId}`, {
        method: 'GET',
      });
      
      if (!response.ok) {
        throw new Error(`Payment verification failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Flutterwave verification error:', error);
      throw error;
    }
  }
}

// Prembly KYC Integration
export class PremblyVerification implements VerificationProvider {
  name = 'Prembly';
  slug = 'prembly';
  private apiKey: string;
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  async verifyIdentity(data: any) {
    try {
      const response = await fetch('/api/verification/identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error(`Identity verification failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Prembly identity verification error:', error);
      throw error;
    }
  }
  
  async verifyBVN(bvn: string) {
    try {
      const response = await fetch('/api/verification/bvn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ bvn }),
      });
      
      if (!response.ok) {
        throw new Error(`BVN verification failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Prembly BVN verification error:', error);
      throw error;
    }
  }
  
  async verifyDriversLicense(licenseNumber: string, data: any) {
    try {
      const response = await fetch('/api/verification/license', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ licenseNumber, ...data }),
      });
      
      if (!response.ok) {
        throw new Error(`Driver's license verification failed: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Prembly driver's license verification error:", error);
      throw error;
    }
  }
}

// Unified payment service that can switch between providers
export function usePaymentService(providerSlug: 'paystack' | 'flutterwave' | 'stripe' = 'paystack') {
  const [provider, setProvider] = useState<PaymentProvider | null>(null);
  
  // Initialize the selected provider
  useState(() => {
    switch (providerSlug) {
      case 'paystack':
        const paystackApiKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';
        setProvider(new PaystackService(paystackApiKey));
        break;
      case 'flutterwave':
        const flutterwaveKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY || '';
        setProvider(new FlutterwaveService(flutterwaveKey));
        break;
      default:
        const defaultKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';
        setProvider(new PaystackService(defaultKey));
    }
  });
  
  // Create a payment using the selected provider
  const createPayment = useErrorHandler(async (amount: number, currency: string, metadata: any) => {
    if (!provider) {
      throw new Error('Payment provider not initialized');
    }
    return provider.createPayment(amount, currency, metadata);
  });
  
  // Verify a payment using the selected provider
  const verifyPayment = useErrorHandler(async (reference: string) => {
    if (!provider) {
      throw new Error('Payment provider not initialized');
    }
    return provider.verifyPayment(reference);
  });
  
  // Change the payment provider dynamically
  const changeProvider = (slug: 'paystack' | 'flutterwave' | 'stripe') => {
    switch (slug) {
      case 'paystack':
        const paystackApiKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';
        setProvider(new PaystackService(paystackApiKey));
        break;
      case 'flutterwave':
        const flutterwaveKey = process.env.NEXT_PUBLIC_FLUTTERWAVE_KEY || '';
        setProvider(new FlutterwaveService(flutterwaveKey));
        break;
      default:
        const defaultKey = process.env.NEXT_PUBLIC_PAYSTACK_KEY || '';
        setProvider(new PaystackService(defaultKey));
    }
  };
  
  return {
    provider,
    createPayment,
    verifyPayment,
    changeProvider,
  };
}

// Hook for using KYC verification services
export function useVerificationService() {
  const [provider, setProvider] = useState<VerificationProvider | null>(null);
  
  // Initialize the Prembly verification provider
  useState(() => {
    const premblyApiKey = process.env.NEXT_PUBLIC_PREMBLY_KEY || '';
    setProvider(new PremblyVerification(premblyApiKey));
  });
  
  // Verify identity using Prembly
  const verifyIdentity = useErrorHandler(async (data: any) => {
    if (!provider) {
      throw new Error('Verification provider not initialized');
    }
    return provider.verifyIdentity(data);
  });
  
  // Verify BVN using Prembly
  const verifyBVN = useErrorHandler(async (bvn: string) => {
    if (!provider || !('verifyBVN' in provider)) {
      throw new Error('BVN verification not supported by the provider');
    }
    return provider.verifyBVN!(bvn);
  });
  
  // Verify driver's license using Prembly
  const verifyDriversLicense = useErrorHandler(async (licenseNumber: string, data: any) => {
    if (!provider || !('verifyDriversLicense' in provider)) {
      throw new Error("Driver's license verification not supported by the provider");
    }
    return provider.verifyDriversLicense!(licenseNumber, data);
  });
  
  return {
    provider,
    verifyIdentity,
    verifyBVN,
    verifyDriversLicense,
  };
}
