'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KYCVerification } from '@/components/auth/KYCVerification'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuth } from '@/contexts/AuthContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { ConnectionStatusHandler } from '@/components/ConnectionStatusHandler'

export default function VerificationPage() {
  const { user, profile } = useAuth()

  return (
    <ProtectedRoute>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl font-bold mb-6">Account Verification</h1>
        
        <ErrorBoundary>
          <ConnectionStatusHandler>
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                  <CardDescription>
                    Your current verification status and available features
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium">Verification Status</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      profile?.is_verified 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {profile?.is_verified ? 'Verified' : 'Pending Verification'}
                    </span>
                  </div>
                  
                  <div className="mt-4 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium mb-2">Basic Account</h3>
                        <ul className="text-sm space-y-2">
                          <li className="flex items-center">
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                            View available trips
                          </li>
                          <li className="flex items-center">
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                            See public information
                          </li>
                          <li className="flex items-center">
                            <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                            Contact support
                          </li>
                        </ul>
                      </div>
                      
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h3 className="font-medium mb-2">Verified Account</h3>
                        <ul className="text-sm space-y-2">
                          <li className={`flex items-center ${profile?.is_verified ? 'text-gray-900' : 'text-gray-400'}`}>
                            <span className={`h-2 w-2 rounded-full mr-2 ${profile?.is_verified ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            Book and manage trips
                          </li>
                          <li className={`flex items-center ${profile?.is_verified ? 'text-gray-900' : 'text-gray-400'}`}>
                            <span className={`h-2 w-2 rounded-full mr-2 ${profile?.is_verified ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            Process payments
                          </li>
                          <li className={`flex items-center ${profile?.is_verified ? 'text-gray-900' : 'text-gray-400'}`}>
                            <span className={`h-2 w-2 rounded-full mr-2 ${profile?.is_verified ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                            Access premium features
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <KYCVerification />
              
              <Card>
                <CardHeader>
                  <CardTitle>Why Verify?</CardTitle>
                  <CardDescription>
                    Benefits of completing identity verification
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-2 text-blue-600">Trust & Safety</h3>
                      <p className="text-sm text-gray-600">
                        Verification creates a trusted ecosystem for all platform users, ensuring everyone is who they claim to be.
                      </p>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-2 text-blue-600">Full Access</h3>
                      <p className="text-sm text-gray-600">
                        Unlock all platform features including payments, bookings, and real-time tracking.
                      </p>
                    </div>
                    
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <h3 className="font-medium mb-2 text-blue-600">Legal Compliance</h3>
                      <p className="text-sm text-gray-600">
                        Meet regulatory requirements for logistics operations in Nigeria.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ConnectionStatusHandler>
        </ErrorBoundary>
      </div>
    </ProtectedRoute>
  )
}
