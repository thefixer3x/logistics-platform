'use client'

import { useState, useEffect, ReactNode } from 'react'
import { RetryButton } from '@/components/RetryButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wifi, WifiOff } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface ConnectionStatusHandlerProps {
  children: ReactNode
  serviceCheck?: () => Promise<boolean>
  checkInterval?: number // in milliseconds
}

export function ConnectionStatusHandler({
  children,
  serviceCheck,
  checkInterval = 30000 // default 30 seconds
}: ConnectionStatusHandlerProps) {
  const [isConnected, setIsConnected] = useState(true)
  const [isChecking, setIsChecking] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  
  const checkConnection = async () => {
    if (isChecking) return // Prevent multiple simultaneous checks
    setIsChecking(true)
    setErrorMessage(null)
    try {
      // Use provided service check or default to Supabase connection check
      const connected = serviceCheck 
        ? await serviceCheck() 
        : await checkSupabaseConnection()
      
      setIsConnected(connected)
    } catch (error) {
      console.error('Connection check failed:', error)
      setIsConnected(false)
      setErrorMessage(getErrorMessage(error))
    } finally {
      setIsChecking(false)
    }
  }
  
  // Default Supabase connection check
  const checkSupabaseConnection = async (): Promise<boolean> => {
    try {
      // First try the health check table
      const { data: healthData, error: healthError } = await supabase
        .from('health_check')
        .select('status')
        .maybeSingle()
      
      if (!healthError && healthData?.status === 'ok') {
        return true
      }

      // If health check fails, try a simple ping
      const { data, error } = await supabase.rpc('ping')
      if (!error) {
        return true
      }

      // If both checks fail, try a basic query
      const { error: queryError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1)
      
      return !queryError
    } catch (e) {
      console.error('Supabase connection error:', e)
      return false
    }
  }

  const getErrorMessage = (error: any): string => {
    if (!error) return 'Unknown connection error'
    
    // Network errors
    if (error.message?.includes('network')) {
      return 'Network connectivity issues. Please check your internet connection.'
    }
    
    // Supabase specific errors
    if (error.message?.includes('JWT')) {
      return 'Authentication error. Please try logging in again.'
    }
    
    if (error.message?.includes('timeout')) {
      return 'Request timed out. The server might be busy.'
    }
    
    // Database errors
    if (error.code === '42P01') {
      return 'Database table not found. Please contact support.'
    }
    
    if (error.code === '23505') {
      return 'Database constraint violation. Please try again.'
    }
    
    // Default error message
    return 'We\'re having trouble connecting to our services. Please try again later.'
  }
  
  useEffect(() => {
    // Initial check
    checkConnection()
    
    // Set up interval for repeated checks
    const intervalId = setInterval(checkConnection, checkInterval)
    
    // Clean up on unmount
    return () => clearInterval(intervalId)
  }, [checkInterval])

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <WifiOff className="h-5 w-5 text-red-500" />
            Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            {errorMessage || 'We\'re having trouble connecting to our services. This could be due to:'}
          </p>
          <ul className="list-disc list-inside text-gray-600 mb-4">
            <li>Network connectivity issues</li>
            <li>Server maintenance</li>
            <li>Database connection problems</li>
          </ul>
          <RetryButton 
            onRetry={isChecking ? undefined : checkConnection}
          />
        </CardContent>
      </Card>
    )
  }

  return <>{children}</>
}
