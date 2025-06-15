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
  
  const checkConnection = async () => {
    setIsChecking(true)
    try {
      // Use provided service check or default to Supabase connection check
      const connected = serviceCheck 
        ? await serviceCheck() 
        : await checkSupabaseConnection()
      
      setIsConnected(connected)
    } catch (error) {
      console.error('Connection check failed:', error)
      setIsConnected(false)
    } finally {
      setIsChecking(false)
    }
  }
  
  // Default Supabase connection check
  const checkSupabaseConnection = async (): Promise<boolean> => {
    try {
      const { data, error } = await supabase.from('health_check').select('status').maybeSingle()
      
      // If table doesn't exist, try a simpler ping
      if (error && error.code === '42P01') {
        const { data, error } = await supabase.rpc('ping')
        return !error
      }
      
      return !error
    } catch (e) {
      console.error('Supabase connection error:', e)
      return false
    }
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
      <Card className="border-amber-200 my-4">
        <CardHeader className="bg-amber-50 text-amber-800">
          <CardTitle className="flex items-center gap-2 text-lg">
            <WifiOff className="h-5 w-5" />
            Connection Error
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <p className="mb-4 text-gray-600">
            We're having trouble connecting to our services. This could be due to:
          </p>
          <ul className="list-disc pl-5 mb-4 text-sm text-gray-600">
            <li>Network connectivity issues</li>
            <li>Server maintenance</li>
            <li>Database connection problems</li>
          </ul>
          <div className="flex justify-end">
            <RetryButton 
              onRetry={checkConnection} 
            />
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return <>{children}</>
}
