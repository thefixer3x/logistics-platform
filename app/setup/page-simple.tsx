'use client'

import { useState } from 'react'

interface DatabaseStatus {
  connected: boolean
  tables: Array<{ name: string; count?: number }>
  error?: string
}

export default function DatabaseSetupPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [setupComplete, setSetupComplete] = useState(false)

  const inspectDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/setup')
      const data = await response.json()
      
      if (data.success) {
        setStatus({
          connected: true,
          tables: Object.entries(data.tables).map(([name, info]: [string, any]) => ({
            name,
            count: info.exists ? info.count : undefined
          }))
        })
      } else {
        setStatus({
          connected: false,
          tables: [],
          error: data.error
        })
      }
    } catch (error) {
      setStatus({
        connected: false,
        tables: [],
        error: error instanceof Error ? error.message : 'Connection failed'
      })
    } finally {
      setLoading(false)
    }
  }

  const setupDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'setup' })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setSetupComplete(true)
        // Refresh the database status
        await inspectDatabase()
      } else {
        setStatus(prev => prev ? { 
          ...prev, 
          error: data.error 
        } : null)
      }
      
    } catch (error) {
      console.error('Setup error:', error)
      setStatus(prev => prev ? { 
        ...prev, 
        error: error instanceof Error ? error.message : 'Setup failed' 
      } : null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Database Setup & Organization
          </h1>
          <p className="text-gray-600">
            Configure and organize your Supabase database for the logistics platform
          </p>
        </div>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Database Connection Status
            </h2>
            {status?.connected ? (
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Connected
              </span>
            ) : status?.connected === false ? (
              <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                Disconnected
              </span>
            ) : (
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                Unknown
              </span>
            )}
          </div>
          
          <button 
            onClick={inspectDatabase} 
            disabled={loading}
            className="mb-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Inspecting...' : 'Inspect Database'}
          </button>
          
          {status?.error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
              <p className="text-red-700 text-sm">{status.error}</p>
            </div>
          )}
          
          {status?.connected && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2 text-gray-900">Tables Status:</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {status.tables.map(table => (
                    <div key={table.name} className="border rounded-md p-3 bg-gray-50">
                      <div className="font-medium text-sm text-gray-900">{table.name}</div>
                      <div className="text-xs text-gray-600">
                        {table.count !== undefined ? (
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            {table.count} records
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                            Not accessible
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Setup Actions */}
        {status?.connected && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Database Setup Actions
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <button 
                  onClick={setupDatabase}
                  disabled={loading || setupComplete}
                  className={`px-4 py-2 rounded-md ${
                    setupComplete 
                      ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  } disabled:opacity-50`}
                >
                  {loading ? 'Setting up...' : 'Create Tables & Insert Sample Data'}
                </button>
                
                {setupComplete && (
                  <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                    Setup Complete
                  </span>
                )}
              </div>
              
              <p className="text-sm text-gray-600">
                This will create the necessary tables and insert sample data for testing.
              </p>
            </div>
          </div>
        )}

        {/* Environment Info */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Environment Configuration
          </h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">Supabase URL:</span>{' '}
              <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}
              </code>
            </div>
            <div>
              <span className="font-medium">Environment:</span>{' '}
              <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                {process.env.NODE_ENV || 'development'}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="text-center">
          <a 
            href="/" 
            className="inline-block px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
