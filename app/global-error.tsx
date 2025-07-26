'use client'

import React from 'react'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html>
      <body>
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow border-red-200">
            <h1 className="text-2xl font-bold mb-4 text-red-800">Something went wrong!</h1>
            <p className="mb-4">An unexpected error occurred in the application.</p>
            {error.message && (
              <div className="bg-gray-50 p-3 rounded text-xs font-mono text-gray-700 overflow-auto mb-4">
                {error.message}
              </div>
            )}
            <div className="flex gap-4 justify-end">
              <button 
                onClick={() => window.location.href = '/'}
                className="px-4 py-2 border rounded hover:bg-gray-50"
              >
                Go to Home
              </button>
              <button 
                onClick={reset}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Try again
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  )
}
