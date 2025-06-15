import { Truck, Wifi, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function OfflinePage() {
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
                <span>Payment processing</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Live notifications</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full" />
                <span>Data synchronization</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3">
            <Button onClick={handleRetry} className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => window.history.back()}
            >
              <Truck className="h-4 w-4 mr-2" />
              Continue Offline
            </Button>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">💡 Offline Tips:</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Your actions will sync when connection is restored</li>
              <li>• Check your WiFi or mobile data connection</li>
              <li>• Some data may be outdated while offline</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
