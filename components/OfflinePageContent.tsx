'use client'

import { Wifi, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function OfflinePageContent() {
  const handleRetry = () => {
    if (typeof window !== 'undefined') {
      window.location.reload()
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-gray-100 rounded-full w-fit">
            <Wifi className="h-8 w-8 text-gray-400" />
          </div>
          <CardTitle className="text-xl">You're Offline</CardTitle>
          <CardDescription>
            It looks like you've lost your internet connection. Don't worry, some features are still available.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Available Offline Features */}
          <div>
            <h3 className="font-medium mb-3">Available Offline:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>View cached dashboard data</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Access recent truck locations</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Record trip updates (will sync later)</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>View offline maintenance alerts</span>
              </li>
            </ul>
          </div>

          {/* Unavailable Features */}
          <div>
            <h3 className="font-medium mb-3">Requires Internet:</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Real-time truck tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Processing payments</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Updating contract terms</span>
              </li>
            </ul>
          </div>

          <Button 
            onClick={handleRetry} 
            className="w-full bg-logistics-500 hover:bg-logistics-600 text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry Connection
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
