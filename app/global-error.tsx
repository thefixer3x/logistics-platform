'use client'
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { RetryButton } from '@/components/RetryButton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertOctagon } from 'lucide-react'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error:', error)
  }, [error])
 
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <Card className="max-w-md w-full border-red-200">
            <CardHeader className="bg-red-50 text-red-800">
              <CardTitle className="flex items-center gap-2">
                <AlertOctagon className="h-5 w-5" />
                Something went wrong!
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <p>
                  An unexpected error occurred in the application. Our team has been notified.
                </p>
                
                {error.message && (
                  <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-700 overflow-auto">
                    {error.message}
                    {error.digest && (
                      <div className="mt-2 text-gray-500">
                        Error ID: {error.digest}
                      </div>
                    )}
                  </div>
                )}
                
                <div className="flex gap-4 justify-end">
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.href = '/'}
                  >
                    Go to Home
                  </Button>
                  <RetryButton onRetry={reset} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </body>
    </html>
  )
}
