import React from 'react'

export const dynamic = 'force-dynamic'

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
        <p className="mb-4">The page you're looking for doesn't exist.</p>
        <a href="/" className="text-blue-600 hover:underline">Go Home</a>
      </div>
    </div>
  )
}
