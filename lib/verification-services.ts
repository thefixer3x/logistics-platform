'use client'

import { VerificationProvider } from './payment-services'

export class PremblyService implements VerificationProvider {
  name = 'Prembly';
  slug = 'prembly';
  
  async verifyIdentity(data: any) {
    try {
      const response = await fetch('/api/verification/prembly', {
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
    return this.verifyIdentity({
      verificationType: 'bvn',
      data: { number: bvn },
      user_id: localStorage.getItem('userId') || '',
    });
  }
  
  async verifyDriversLicense(licenseNumber: string, data: any) {
    return this.verifyIdentity({
      verificationType: 'drivers_license',
      data: { 
        number: licenseNumber,
        first_name: data.first_name,
        last_name: data.last_name,
        dob: data.dob,
      },
      user_id: localStorage.getItem('userId') || '',
    });
  }
}
