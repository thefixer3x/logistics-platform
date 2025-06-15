'use client'

import { useState } from 'react'

export default function SimpleSetupPage() {
  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    console.log('Testing connection...')
    try {
      const response = await fetch('/api/setup')
      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)
      setStatus(data)
    } catch (error) {
      console.error('Connection test error:', error)
      setStatus({ success: false, error: error instanceof Error ? error.message : 'Unknown error' })
    } finally {
      setLoading(false)
    }
  }

  const setupDatabase = async () => {
    setLoading(true)
    console.log('Setting up database...')
    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'setup' })
      })
      console.log('Setup response status:', response.status)
      const data = await response.json()
      console.log('Setup response data:', data)
      setStatus(data)
    } catch (error) {
      console.error('Setup error:', error)
      setStatus({ success: false, error: error instanceof Error ? error.message : 'Setup failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Database Setup - Test Interface</h1>
      
      <div className="space-y-6">
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Database Operations</h2>
          
          <div className="flex gap-4 mb-4">
            <button 
              onClick={testConnection}
              disabled={loading}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
            
            <button 
              onClick={setupDatabase}
              disabled={loading}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Setting up...' : 'Setup Database'}
            </button>
          </div>
          
          <div className="text-sm text-gray-600">
            <p>• Test Connection: Checks if Supabase is accessible and lists existing tables</p>
            <p>• Setup Database: Creates the required tables and inserts sample data</p>
          </div>
        </div>

        {status && (
          <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
            <h3 className="text-lg font-medium mb-3 text-gray-800">
              Result: 
              <span className={`ml-2 px-2 py-1 text-xs rounded ${
                status.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {status.success ? 'Success' : 'Error'}
              </span>
            </h3>
            <div className="bg-gray-50 border rounded p-4">
              <pre className="text-sm overflow-auto text-gray-700 whitespace-pre-wrap">
                {JSON.stringify(status, null, 2)}
              </pre>
            </div>
          </div>
        )}
        
        <div className="border border-gray-200 rounded-lg p-6 bg-white shadow-sm">
          <h3 className="text-lg font-medium mb-3 text-gray-800">Environment Configuration</h3>
          <div className="text-sm space-y-2 text-gray-600">
            <div>
              <strong>Supabase URL:</strong>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}
              </code>
            </div>
            <div>
              <strong>Environment:</strong>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {process.env.NODE_ENV || 'development'}
              </code>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <a 
            href="/setup" 
            className="text-blue-500 hover:text-blue-700 underline"
          >
            ← Back to Full Setup Interface
          </a>
        </div>
      </div>
    </div>
  )
}
