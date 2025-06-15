'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Loader2, CheckCircle, AlertCircle, UserCheck } from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import { useAuth } from '@/contexts/AuthContext'
import { PremblyService } from '@/lib/verification-services'

export function KYCVerification() {
  const { user, profile, refreshProfile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [verificationMethod, setVerificationMethod] = useState<'bvn' | 'nin' | 'drivers_license'>('bvn')
  const [verificationStatus, setVerificationStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [formData, setFormData] = useState({
    bvn: '',
    nin: '',
    license: {
      number: '',
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      dob: ''
    }
  })

  const premblyService = new PremblyService()

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    section: 'bvn' | 'nin' | 'license',
    field?: string
  ) => {
    if (section === 'bvn') {
      setFormData({ ...formData, bvn: e.target.value })
    } else if (section === 'nin') {
      setFormData({ ...formData, nin: e.target.value })
    } else if (section === 'license') {
      setFormData({
        ...formData,
        license: {
          ...formData.license,
          [field as string]: e.target.value
        }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setVerificationStatus('loading')

    try {
      let response

      if (verificationMethod === 'bvn') {
        response = await premblyService.verifyBVN(formData.bvn)
      } else if (verificationMethod === 'nin') {
        response = await premblyService.verifyIdentity({
          verificationType: 'nin',
          data: { number: formData.nin },
          user_id: user?.id || ''
        })
      } else if (verificationMethod === 'drivers_license') {
        response = await premblyService.verifyDriversLicense(
          formData.license.number,
          {
            first_name: formData.license.first_name,
            last_name: formData.license.last_name,
            dob: formData.license.dob
          }
        )
      }

      if (response?.status) {
        setVerificationStatus('success')
        toast({
          title: 'Verification Successful',
          description: 'Your identity has been verified successfully.',
          variant: 'success'
        })
        
        // Refresh the user profile to get updated verification status
        refreshProfile?.()
      } else {
        setVerificationStatus('error')
        toast({
          title: 'Verification Failed',
          description: response?.message || 'Identity verification failed. Please check your information and try again.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Verification error:', error)
      setVerificationStatus('error')
      toast({
        title: 'Verification Error',
        description: 'An error occurred during verification. Please try again later.',
        variant: 'destructive'
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (profile?.is_verified) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-green-600">
            <CheckCircle className="h-5 w-5 mr-2" />
            Verification Complete
          </CardTitle>
          <CardDescription>
            Your identity has been verified successfully.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-green-800">
            <p className="text-sm">
              Your account is fully verified and you can access all platform features.
              Verification level: {profile.verification_level || 2}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <UserCheck className="h-5 w-5 mr-2" />
          Identity Verification (KYC)
        </CardTitle>
        <CardDescription>
          Verify your identity to access all platform features
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={verificationMethod} onValueChange={(value) => setVerificationMethod(value as any)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="bvn">BVN</TabsTrigger>
            <TabsTrigger value="nin">NIN</TabsTrigger>
            <TabsTrigger value="drivers_license">Driver's License</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bvn">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bvn">Bank Verification Number (BVN)</Label>
                <Input
                  id="bvn"
                  type="text"
                  placeholder="Enter your 11-digit BVN"
                  value={formData.bvn}
                  onChange={(e) => handleInputChange(e, 'bvn')}
                  pattern="[0-9]{11}"
                  maxLength={11}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Your BVN is a secure way to verify your identity with the banking system.
                </p>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || !formData.bvn || formData.bvn.length !== 11}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify BVN'
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="nin">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nin">National Identification Number (NIN)</Label>
                <Input
                  id="nin"
                  type="text"
                  placeholder="Enter your 11-digit NIN"
                  value={formData.nin}
                  onChange={(e) => handleInputChange(e, 'nin')}
                  pattern="[0-9]{11}"
                  maxLength={11}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-500">
                  Your NIN is required for identity verification as per government regulations.
                </p>
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || !formData.nin || formData.nin.length !== 11}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify NIN'
                )}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="drivers_license">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="license_number">Driver's License Number</Label>
                <Input
                  id="license_number"
                  type="text"
                  placeholder="Enter your driver's license number"
                  value={formData.license.number}
                  onChange={(e) => handleInputChange(e, 'license', 'number')}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name">First Name</Label>
                  <Input
                    id="first_name"
                    type="text"
                    placeholder="First name"
                    value={formData.license.first_name}
                    onChange={(e) => handleInputChange(e, 'license', 'first_name')}
                    required
                    disabled={isLoading}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="last_name">Last Name</Label>
                  <Input
                    id="last_name"
                    type="text"
                    placeholder="Last name"
                    value={formData.license.last_name}
                    onChange={(e) => handleInputChange(e, 'license', 'last_name')}
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dob">Date of Birth</Label>
                <Input
                  id="dob"
                  type="date"
                  value={formData.license.dob}
                  onChange={(e) => handleInputChange(e, 'license', 'dob')}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isLoading || !formData.license.number || !formData.license.dob}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  'Verify Driver\'s License'
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="flex flex-col">
        {verificationStatus === 'success' && (
          <div className="p-4 w-full bg-green-50 rounded-lg border border-green-200 text-green-800 mb-4">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" />
              <p className="text-sm font-medium">Verification successful!</p>
            </div>
            <p className="text-xs mt-1">
              Your identity has been verified. It may take a few moments for all systems to update.
            </p>
          </div>
        )}
        
        {verificationStatus === 'error' && (
          <div className="p-4 w-full bg-red-50 rounded-lg border border-red-200 text-red-800 mb-4">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              <p className="text-sm font-medium">Verification failed</p>
            </div>
            <p className="text-xs mt-1">
              Please check your information and try again. If the problem persists, contact support.
            </p>
          </div>
        )}
        
        <p className="text-xs text-gray-500 text-center w-full">
          Your data is securely processed and encrypted in compliance with data protection regulations.
        </p>
      </CardFooter>
    </Card>
  )
}
