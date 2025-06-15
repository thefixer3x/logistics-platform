'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { useAuth } from './AuthContext'
import { supabase, realtimeConfig } from '@/lib/supabase'

interface TruckLocation {
  truck_id: string
  latitude: number
  longitude: number
  speed?: number
  heading?: number
  recorded_at: string
}

interface RealtimeUpdate {
  id: string
  type: 'location_update' | 'trip_update' | 'maintenance_alert' | 'payment_update' | 'notification'
  timestamp: Date
  data: any
  priority: 'low' | 'medium' | 'high' | 'critical'
}

interface RealtimeContextType {
  isConnected: boolean
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
  truckLocations: Map<string, TruckLocation>
  realtimeUpdates: RealtimeUpdate[]
  subscribeTruckLocations: () => void
  subscribeTrips: () => void
  subscribeMaintenance: () => void
  subscribePayments: () => void
  subscribeNotifications: () => void
  clearUpdates: () => void
  getLatestUpdate: (type: string) => RealtimeUpdate | null
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined)

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const [connectionStatus, setConnectionStatus] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected')
  const [isConnected, setIsConnected] = useState(false)
  const [truckLocations, setTruckLocations] = useState(new Map<string, TruckLocation>())
  const [realtimeUpdates, setRealtimeUpdates] = useState<RealtimeUpdate[]>([])
  const [channels, setChannels] = useState<any[]>([])
  const { user, profile } = useAuth()
  
  // Generate unique update ID
  const generateUpdateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  // Add new realtime update
  const addRealtimeUpdate = useCallback((type: RealtimeUpdate['type'], data: any, priority: RealtimeUpdate['priority'] = 'medium') => {
    const update: RealtimeUpdate = {
      id: generateUpdateId(),
      type,
      timestamp: new Date(),
      data,
      priority
    }
    
    setRealtimeUpdates(prev => {
      const updated = [update, ...prev].slice(0, 100) // Keep last 100 updates
      return updated.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    })
  }, [])

  // Initialize real-time connections
  useEffect(() => {
    if (!user || !profile) {
      setConnectionStatus('disconnected')
      setIsConnected(false)
      return
    }

    let mounted = true
    const activeChannels: any[] = []

    const setupRealtimeSubscriptions = async () => {
      try {
        setConnectionStatus('connecting')

        // Clean up any existing channels first
        channels.forEach(channel => {
          try {
            channel.unsubscribe()
          } catch (error) {
            console.error('Error unsubscribing from existing channel:', error)
          }
        })

        // 1. Truck Locations - Real-time GPS tracking
        const locationChannel = supabase
          .channel(realtimeConfig.channels.truck_tracking)
          .on('postgres_changes', {
            event: '*',
            schema: 'logistics',
            table: 'truck_locations'
          }, (payload: any) => {
            if (!mounted) return
            
            if (payload.new?.truck_id) {
              const locationData: TruckLocation = {
                truck_id: payload.new.truck_id,
                latitude: payload.new.latitude,
                longitude: payload.new.longitude,
                speed: payload.new.speed,
                heading: payload.new.heading,
                recorded_at: payload.new.recorded_at
              }

              setTruckLocations(prev => {
                const updated = new Map(prev)
                updated.set(payload.new.truck_id, locationData)
                return updated
              })
              
              addRealtimeUpdate('location_update', locationData, 'low')
            }
          })
          .subscribe((status) => {
            console.log('Location channel status:', status)
          })

        activeChannels.push(locationChannel)

        // 2. Trip Updates - Status changes, delays, completions
        const tripChannel = supabase
          .channel(realtimeConfig.channels.trip_updates)
          .on('postgres_changes', {
            event: '*',
            schema: 'logistics',
            table: 'trips'
          }, (payload) => {
            if (!mounted) return
            
            let priority: RealtimeUpdate['priority'] = 'medium'
            const tripData = payload.new as any
            if (tripData?.status === 'completed') priority = 'low'
            if (tripData?.status === 'delayed') priority = 'high'
            if (tripData?.status === 'cancelled') priority = 'high'
            
            addRealtimeUpdate('trip_update', tripData, priority)
          })
          .subscribe()

        activeChannels.push(tripChannel)

        // 3. Maintenance Alerts - Critical for fleet management
        const maintenanceChannel = supabase
          .channel(realtimeConfig.channels.maintenance_alerts)
          .on('postgres_changes', {
            event: '*',
            schema: 'logistics',
            table: 'predictive_maintenance'
          }, (payload) => {
            if (!mounted) return
            
            let priority: RealtimeUpdate['priority'] = 'medium'
            const maintenanceData = payload.new as any
            if (maintenanceData?.maintenance_priority === 'critical') priority = 'critical'
            if (maintenanceData?.maintenance_priority === 'high') priority = 'high'
            
            addRealtimeUpdate('maintenance_alert', maintenanceData, priority)
          })
          .subscribe()

        activeChannels.push(maintenanceChannel)

        // 4. Payment Updates - For financial tracking
        if (['supervisor', 'contractor', 'admin'].includes(profile.role)) {
          const paymentChannel = supabase
            .channel(realtimeConfig.channels.payments)
            .on('postgres_changes', {
              event: '*',
              schema: 'payments',
              table: 'payments'
            }, (payload) => {
              if (!mounted) return
              
              let priority: RealtimeUpdate['priority'] = 'medium'
              const paymentData = payload.new as any
              if (paymentData?.status === 'failed') priority = 'high'
              if (paymentData?.amount && paymentData.amount > 100000) priority = 'high'
              
              addRealtimeUpdate('payment_update', paymentData, priority)
            })
            .subscribe()

          activeChannels.push(paymentChannel)
        }

        // 5. Personal Notifications - User-specific notifications
        const notificationChannel = supabase
          .channel(`${realtimeConfig.channels.notifications}_${user.id}`)
          .on('postgres_changes', {
            event: 'INSERT',
            schema: 'logistics',
            table: 'notifications',
            filter: `user_id=eq.${user.id}`
          }, (payload) => {
            if (!mounted) return
            
            let priority: RealtimeUpdate['priority'] = 'medium'
            const notificationData = payload.new as any
            if (notificationData?.type === 'error') priority = 'critical'
            if (notificationData?.type === 'warning') priority = 'high'
            
            addRealtimeUpdate('notification', notificationData, priority)
          })
          .subscribe()

        activeChannels.push(notificationChannel)

        // 6. Role-specific subscriptions
        if (profile.role === 'driver') {
          // Driver-specific trip assignments
          const driverTripChannel = supabase
            .channel(`driver_trips_${user.id}`)
            .on('postgres_changes', {
              event: '*',
              schema: 'logistics',
              table: 'trips',
              filter: `driver_id=eq.${user.id}`
            }, (payload) => {
              if (!mounted) return
              addRealtimeUpdate('trip_update', payload.new, 'high')
            })
            .subscribe()

          activeChannels.push(driverTripChannel)
        }

        setChannels(activeChannels)
        setConnectionStatus('connected')
        setIsConnected(true)

        console.log(`Realtime subscriptions established for ${profile.role}:`, activeChannels.length, 'channels')

      } catch (error) {
        console.error('Error setting up realtime subscriptions:', error)
        setConnectionStatus('error')
        setIsConnected(false)
      }
    }

    setupRealtimeSubscriptions()

    return () => {
      mounted = false
      
      // Properly cleanup all channels to prevent WebSocket warnings
      activeChannels.forEach(channel => {
        try {
          supabase.removeChannel(channel)
        } catch (error) {
          console.error('Error removing channel:', error)
        }
      })
      
      setConnectionStatus('disconnected')
      setIsConnected(false)
      setChannels([])
    }
  }, [user, profile, supabase, addRealtimeUpdate])

  // Manual subscription functions for specific features
  const subscribeTruckLocations = useCallback(() => {
    // Implementation for additional truck location subscriptions
    console.log('Manual truck location subscription activated')
  }, [user?.id])

  const subscribeTrips = useCallback(() => {
    // Implementation for additional trip subscriptions
    console.log('Manual trip subscription activated')
  }, [user?.id])

  const subscribeMaintenance = useCallback(() => {
    // Implementation for additional maintenance subscriptions
    console.log('Manual maintenance subscription activated')
  }, [user?.id])

  const subscribePayments = useCallback(() => {
    // Implementation for additional payment subscriptions
    console.log('Manual payment subscription activated')
  }, [user?.id])

  const subscribeNotifications = useCallback(() => {
    // Implementation for additional notification subscriptions
    console.log('Manual notification subscription activated')
  }, [user?.id])

  const clearUpdates = useCallback(() => {
    setRealtimeUpdates([])
  }, [])

  const getLatestUpdate = useCallback((type: string): RealtimeUpdate | null => {
    return realtimeUpdates.find(update => update.type === type) || null
  }, [realtimeUpdates])

  const value = {
    isConnected,
    connectionStatus,
    truckLocations,
    realtimeUpdates,
    subscribeTruckLocations,
    subscribeTrips,
    subscribeMaintenance,
    subscribePayments,
    subscribeNotifications,
    clearUpdates,
    getLatestUpdate,
  }

  return (
    <RealtimeContext.Provider value={value}>
      {children}
    </RealtimeContext.Provider>
  )
}

export function useRealtime() {
  const context = useContext(RealtimeContext)
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider')
  }
  return context
}
