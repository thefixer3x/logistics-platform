import { createClient } from '@supabase/supabase-js'

// Unified Supabase Configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mxtsdgkwzjzlttpotole.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dHNkZ2t3emp6bHR0cG90b2xlIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODcyNzAyNzAsImV4cCI6MjAwMjg0NjI3MH0.demo-key-for-local-development-only'
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14dHNkZ2t3emp6bHR0cG90b2xlIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTY4NzI3MDI3MCwiZXhwIjoyMDAyODQ2MjcwfQ.demo-key-for-local-development-only'

// Display warning during development if using fallback values
if (process.env.NODE_ENV !== 'production' && typeof window !== 'undefined') {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn('⚠️ Using placeholder Supabase credentials. Set up your .env.local file for proper configuration.')
  }
}

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side Supabase client with service role (for admin operations)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// Server component client factory function
export const createServerSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey)
}

// Alias for createServerSupabaseClient to match import in route.ts
export const createSupabaseServerClient = createServerSupabaseClient

// Real-time subscriptions configuration
export const realtimeConfig = {
  channels: {
    truck_tracking: 'truck_tracking',
    trip_updates: 'trip_updates', 
    maintenance_alerts: 'maintenance_alerts',
    notifications: 'user_notifications',
    payments: 'payment_updates'
  },
  tables: {
    profiles: 'profiles',
    trucks: 'trucks',
    trips: 'trips',
    truck_locations: 'truck_locations',
    maintenance_requests: 'maintenance_requests',
    payments: 'payments',
    notifications: 'notifications',
    contracts: 'contracts',
    sla_reports: 'sla_reports'
  }
}

// Database Types
export interface Profile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone: string
  role: 'driver' | 'supervisor' | 'contractor' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Truck {
  id: string
  license_plate: string
  make: string
  model: string
  year: number
  status: 'active' | 'maintenance' | 'inactive'
  current_driver_id?: string
  last_maintenance: string
  next_maintenance: string
  created_at: string
}

export interface Trip {
  id: string
  trip_id: string
  driver_id: string
  truck_id: string
  origin: string
  destination: string
  distance: number
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  start_time?: string
  end_time?: string
  estimated_arrival?: string
  load_status: string
  created_at: string
}

export interface Contract {
  id: string
  contractor_id: string
  title: string
  description: string
  start_date: string
  end_date: string
  status: 'active' | 'completed' | 'terminated'
  weekly_target: number
  payment_rate: number
  created_at: string
}

export interface Payment {
  id: string
  contract_id: string
  driver_id?: string
  amount: number
  type: 'weekly_payment' | 'feeding_allowance' | 'bonus' | 'penalty'
  status: 'pending' | 'processed' | 'failed'
  due_date: string
  processed_date?: string
  created_at: string
}

export interface Incident {
  id: string
  driver_id: string
  truck_id: string
  type: 'accident' | 'breakdown' | 'violation' | 'other'
  description: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  location?: string
  reported_at: string
  resolved_at?: string
}

// Database Functions
export const db = {
  // Profile functions
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  async updateProfile(userId: string, updates: Partial<Profile>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Trip functions
  async getDriverTrips(driverId: string, limit = 10) {
    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        truck:trucks(*),
        payments(*)
      `)
      .eq('driver_id', driverId)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data
  },

  async createTrip(tripData: Omit<Trip, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('trips')
      .insert(tripData)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async updateTripStatus(tripId: string, status: Trip['status'], updates?: Partial<Trip>) {
    const { data, error } = await supabase
      .from('trips')
      .update({ status, ...updates })
      .eq('id', tripId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Fleet functions
  async getFleetTrucks(supervisorId?: string) {
    let query = supabase
      .from('trucks')
      .select(`
        *,
        current_driver:profiles(*),
        current_trip:trips(*)
      `)
    
    if (supervisorId) {
      query = query.eq('supervisor_id', supervisorId)
    }
    
    const { data, error } = await query
    if (error) throw error
    return data
  },

  async updateTruckStatus(truckId: string, status: Truck['status']) {
    const { data, error } = await supabase
      .from('trucks')
      .update({ status })
      .eq('id', truckId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Payment functions
  async getPayments(filters: { driverId?: string; contractId?: string; status?: string }) {
    let query = supabase
      .from('payments')
      .select(`
        *,
        driver:profiles(*),
        contract:contracts(*)
      `)
    
    if (filters.driverId) {
      query = query.eq('driver_id', filters.driverId)
    }
    
    if (filters.contractId) {
      query = query.eq('contract_id', filters.contractId)
    }
    
    if (filters.status) {
      query = query.eq('status', filters.status)
    }
    
    const { data, error } = await query.order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async processPayment(paymentId: string) {
    const { data, error } = await supabase
      .from('payments')
      .update({ 
        status: 'processed',
        processed_date: new Date().toISOString()
      })
      .eq('id', paymentId)
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  // Incident functions
  async createIncident(incidentData: Omit<Incident, 'id' | 'reported_at'>) {
    const { data, error } = await supabase
      .from('incidents')
      .insert({
        ...incidentData,
        reported_at: new Date().toISOString()
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  async getIncidents(supervisorId?: string) {
    let query = supabase
      .from('incidents')
      .select(`
        *,
        driver:profiles(*),
        truck:trucks(*)
      `)
    
    if (supervisorId) {
      query = query.eq('supervisor_id', supervisorId)
    }
    
    const { data, error } = await query.order('reported_at', { ascending: false })
    if (error) throw error
    return data
  },

  // Real-time subscriptions
  subscribeToTripUpdates(driverId: string, callback: (payload: any) => void) {
    return supabase
      .channel('trip-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trips',
          filter: `driver_id=eq.${driverId}`
        },
        callback
      )
      .subscribe()
  },

  subscribeToFleetUpdates(supervisorId: string, callback: (payload: any) => void) {
    return supabase
      .channel('fleet-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trucks',
          filter: `supervisor_id=eq.${supervisorId}`
        },
        callback
      )
      .subscribe()
  }
}
