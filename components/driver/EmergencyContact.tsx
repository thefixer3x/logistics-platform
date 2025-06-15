'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase'
import { AlertCircle, CheckCircle, Phone } from 'lucide-react'

interface EmergencyContactProps {
  driverId: string
}

export function EmergencyContact({ driverId }: EmergencyContactProps) {
  const [contacts, setContacts] = useState<Array<{id: string, name: string, phone: string, relationship: string}>>([])
  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [relationship, setRelationship] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  // Load contacts on component mount
  useState(() => {
    if (!driverId) return
    
    const fetchContacts = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('emergency_contacts')
          .select('*')
          .eq('driver_id', driverId)
        
        if (error) throw error
        
        setContacts(data || [])
      } catch (error) {
        console.error('Error loading emergency contacts:', error)
        setStatus('error')
        setMessage('Failed to load emergency contacts')
      } finally {
        setLoading(false)
      }
    }
    
    fetchContacts()
  })

  const handleSaveContact = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!name || !phone) {
      setStatus('error')
      setMessage('Name and phone are required')
      return
    }
    
    setLoading(true)
    setStatus('idle')
    
    try {
      const { data, error } = await supabase
        .from('emergency_contacts')
        .insert({
          driver_id: driverId,
          name,
          phone,
          relationship,
          created_at: new Date().toISOString()
        })
        .select()
      
      if (error) throw error
      
      setContacts([...contacts, data[0]])
      setName('')
      setPhone('')
      setRelationship('')
      setStatus('success')
      setMessage('Emergency contact saved successfully')
    } catch (error) {
      console.error('Error saving emergency contact:', error)
      setStatus('error')
      setMessage('Failed to save emergency contact')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Emergency Contacts</CardTitle>
        <CardDescription>Add and manage your emergency contacts</CardDescription>
      </CardHeader>
      <CardContent>
        {status === 'error' && (
          <div className="bg-red-50 p-2 rounded-md mb-4 text-sm flex items-center text-red-700">
            <AlertCircle className="h-4 w-4 mr-2" />
            {message}
          </div>
        )}
        
        {status === 'success' && (
          <div className="bg-green-50 p-2 rounded-md mb-4 text-sm flex items-center text-green-700">
            <CheckCircle className="h-4 w-4 mr-2" />
            {message}
          </div>
        )}

        <form onSubmit={handleSaveContact} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Contact Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter contact name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="relationship">Relationship</Label>
              <Input
                id="relationship"
                value={relationship}
                onChange={(e) => setRelationship(e.target.value)}
                placeholder="E.g., Spouse, Parent, Friend"
              />
            </div>
          </div>
          
          <Button type="submit" disabled={loading}>
            {loading ? 'Saving...' : 'Add Contact'}
          </Button>
        </form>
        
        {contacts.length > 0 && (
          <div className="mt-6">
            <h3 className="text-sm font-medium mb-2">Your Emergency Contacts</h3>
            <div className="space-y-3">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center p-3 border rounded-md">
                  <div className="bg-primary/10 p-2 rounded-full mr-3">
                    <Phone className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.phone}</p>
                    {contact.relationship && (
                      <p className="text-xs text-gray-400">{contact.relationship}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
