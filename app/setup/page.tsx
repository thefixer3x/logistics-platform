'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface DatabaseStatus {
  connected: boolean
  schemas: string[]
  tables: Array<{ schema: string; name: string; count?: number }>
  error?: string
}

export default function DatabaseSetupPage() {
  const [status, setStatus] = useState<DatabaseStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [setupStep, setSetupStep] = useState<'inspect' | 'organize' | 'populate' | 'complete'>('inspect')

  const inspectDatabase = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/setup')
      const data = await response.json()
      
      if (data.success) {
        setStatus({
          connected: true,
          schemas: ['public', 'auth'],
          tables: Object.entries(data.tables).map(([name, info]: [string, any]) => ({
            schema: 'public',
            name,
            count: info.exists ? info.count : undefined
          }))
        })
      } else {
        setStatus({
          connected: false,
          schemas: [],
          tables: [],
          error: data.error
        })
      }
    } catch (error) {
      setStatus({
        connected: false,
        schemas: [],
        tables: [],
        error: error instanceof Error ? error.message : 'Connection failed'
      })
    } finally {
      setLoading(false)
    }
  }

  const createBasicTables = async () => {
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
        setSetupStep('complete')
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

  const insertSampleData = async () => {
    const sampleProfiles = [
      {
        email: 'admin@seftech.com',
        first_name: 'System',
        last_name: 'Administrator',
        role: 'admin',
        status: 'active'
      },
      {
        email: 'contractor1@seftech.com',
        first_name: 'Adebayo',
        last_name: 'Okafor',
        phone: '+234-801-234-5678',
        role: 'contractor',
        company_name: 'Lagos Logistics Ltd',
        status: 'active'
      },
      {
        email: 'driver1@seftech.com',
        first_name: 'Musa',
        last_name: 'Abdullahi',
        phone: '+234-811-111-1111',
        role: 'driver',
        status: 'active'
      },
      {
        email: 'supervisor1@seftech.com',
        first_name: 'Folake',
        last_name: 'Adeyemi',
        phone: '+234-805-567-8901',
        role: 'supervisor',
        status: 'active'
      }
    ]

    const { error } = await supabaseAdmin
      .from('profiles')
      .upsert(sampleProfiles, { onConflict: 'email' })

    if (error) {
      throw error
    }
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Database Setup & Organization</h1>
        <p className="text-gray-600">
          Configure and organize your Supabase database for the logistics platform
        </p>
      </div>

      <div className="grid gap-6">
        {/* Connection Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Database Connection Status
              {status?.connected ? (
                <Badge variant="default" className="bg-green-500">Connected</Badge>
              ) : status?.connected === false ? (
                <Badge variant="destructive">Disconnected</Badge>
              ) : (
                <Badge variant="secondary">Unknown</Badge>
              )}
            </CardTitle>
            <CardDescription>
              Current connection status to Supabase database
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={inspectDatabase} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? 'Inspecting...' : 'Inspect Database'}
            </Button>
            
            {status?.error && (
              <div className="bg-red-50 border border-red-200 rounded p-3 mb-4">
                <p className="text-red-700 text-sm">{status.error}</p>
              </div>
            )}
            
            {status?.connected && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Available Schemas:</h4>
                  <div className="flex gap-2">
                    {status.schemas.map(schema => (
                      <Badge key={schema} variant="outline">{schema}</Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Tables Status:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {status.tables.map(table => (
                      <div key={table.name} className="border rounded p-3">
                        <div className="font-medium text-sm">{table.name}</div>
                        <div className="text-xs text-gray-500">
                          {table.count !== undefined ? (
                            <Badge variant="default" className="bg-green-500">
                              {table.count} records
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Not accessible</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Setup Actions */}
        {status?.connected && (
          <Card>
            <CardHeader>
              <CardTitle>Database Setup Actions</CardTitle>
              <CardDescription>
                Organize and populate your database with initial data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={createBasicTables}
                    disabled={loading || setupStep === 'complete'}
                    variant={setupStep === 'complete' ? 'outline' : 'default'}
                  >
                    {loading ? 'Setting up...' : 'Create Tables & Insert Sample Data'}
                  </Button>
                  
                  {setupStep === 'complete' && (
                    <Badge variant="default" className="bg-green-500">
                      Setup Complete
                    </Badge>
                  )}
                </div>
                
                <div className="text-sm text-gray-600">
                  This will create the necessary tables and insert sample data for testing.
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Environment Info */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Configuration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium">Supabase URL:</span>{' '}
                <code className="bg-gray-100 px-2 py-1 rounded">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL || 'Not configured'}
                </code>
              </div>
              <div>
                <span className="font-medium">Environment:</span>{' '}
                <Badge variant="outline">
                  {process.env.NODE_ENV || 'development'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
