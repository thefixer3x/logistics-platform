-- Database setup functions for the logistics platform
-- These can be executed via RPC calls from the client

-- Function to create profiles table with proper structure
CREATE OR REPLACE FUNCTION public.create_profiles_table()
RETURNS text AS $$
BEGIN
  -- Create profiles table if it doesn't exist
  CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email VARCHAR NOT NULL UNIQUE,
    first_name VARCHAR,
    last_name VARCHAR,
    phone VARCHAR,
    role VARCHAR CHECK (role IN ('driver', 'supervisor', 'contractor', 'admin')) DEFAULT 'driver',
    company_name VARCHAR,
    avatar_url TEXT,
    status VARCHAR CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  -- Enable RLS
  ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

  -- Create basic RLS policies
  DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
  CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid()::text = id::text);

  DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
  CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid()::text = id::text);

  -- Create trucks table
  CREATE TABLE IF NOT EXISTS public.trucks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    license_plate VARCHAR NOT NULL UNIQUE,
    make VARCHAR NOT NULL,
    model VARCHAR NOT NULL,
    year INTEGER,
    status VARCHAR CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
    driver_id UUID REFERENCES public.profiles(id),
    contractor_id UUID REFERENCES public.profiles(id),
    odometer_reading INTEGER DEFAULT 0,
    fuel_capacity DECIMAL(8,2),
    payload_capacity DECIMAL(10,2),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  ALTER TABLE public.trucks ENABLE ROW LEVEL SECURITY;

  -- Create trips table
  CREATE TABLE IF NOT EXISTS public.trips (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    truck_id UUID NOT NULL REFERENCES public.trucks(id),
    driver_id UUID NOT NULL REFERENCES public.profiles(id),
    customer_id UUID REFERENCES public.profiles(id),
    contract_id UUID,
    origin VARCHAR NOT NULL,
    destination VARCHAR NOT NULL,
    status VARCHAR CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
    distance DECIMAL(10,2),
    scheduled_pickup TIMESTAMP WITH TIME ZONE,
    scheduled_delivery TIMESTAMP WITH TIME ZONE,
    actual_pickup TIMESTAMP WITH TIME ZONE,
    actual_delivery TIMESTAMP WITH TIME ZONE,
    cargo_type VARCHAR,
    cargo_weight DECIMAL(10,2),
    cargo_value DECIMAL(12,2),
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE
  );

  ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;

  -- Create contracts table
  CREATE TABLE IF NOT EXISTS public.contracts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    contractor_id UUID NOT NULL REFERENCES public.profiles(id),
    driver_id UUID REFERENCES public.profiles(id),
    contract_type VARCHAR CHECK (contract_type IN ('mou', 'service', 'employment')) DEFAULT 'mou',
    start_date DATE NOT NULL,
    end_date DATE,
    terms JSONB,
    daily_allowance DECIMAL(10,2) DEFAULT 5000.00,
    maintenance_limit DECIMAL(12,2) DEFAULT 100000.00,
    sla_requirements JSONB,
    status VARCHAR CHECK (status IN ('draft', 'active', 'expired', 'terminated')) DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;

  -- Create payments table
  CREATE TABLE IF NOT EXISTS public.payments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    contract_id UUID REFERENCES public.contracts(id),
    amount DECIMAL(12,2) NOT NULL,
    payment_type VARCHAR CHECK (payment_type IN ('trip_payment', 'daily_allowance', 'maintenance', 'fuel', 'bonus', 'penalty')) DEFAULT 'trip_payment',
    payment_method VARCHAR CHECK (payment_method IN ('bank_transfer', 'cash', 'mobile_money', 'check')) DEFAULT 'bank_transfer',
    status VARCHAR CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'cancelled')) DEFAULT 'pending',
    reference_id VARCHAR,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

  -- Create notifications table
  CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id),
    title VARCHAR NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR CHECK (type IN ('info', 'warning', 'error', 'success')) DEFAULT 'info',
    priority VARCHAR CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
    status VARCHAR CHECK (status IN ('unread', 'read', 'archived')) DEFAULT 'unread',
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
  );

  ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

  -- Create maintenance_requests table
  CREATE TABLE IF NOT EXISTS public.maintenance_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    truck_id UUID NOT NULL REFERENCES public.trucks(id),
    requested_by UUID NOT NULL REFERENCES public.profiles(id),
    maintenance_type VARCHAR CHECK (maintenance_type IN ('routine', 'repair', 'inspection', 'emergency')) DEFAULT 'routine',
    priority VARCHAR CHECK (priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
    status VARCHAR CHECK (status IN ('pending', 'approved', 'in_progress', 'completed', 'rejected')) DEFAULT 'pending',
    description TEXT NOT NULL,
    estimated_cost DECIMAL(12,2),
    actual_cost DECIMAL(12,2),
    scheduled_date DATE,
    completed_date DATE,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );

  ALTER TABLE public.maintenance_requests ENABLE ROW LEVEL SECURITY;

  -- Create indexes for performance
  CREATE INDEX IF NOT EXISTS idx_trucks_driver ON public.trucks(driver_id);
  CREATE INDEX IF NOT EXISTS idx_trucks_contractor ON public.trucks(contractor_id);
  CREATE INDEX IF NOT EXISTS idx_trips_truck ON public.trips(truck_id);
  CREATE INDEX IF NOT EXISTS idx_trips_driver ON public.trips(driver_id);
  CREATE INDEX IF NOT EXISTS idx_trips_status ON public.trips(status);
  CREATE INDEX IF NOT EXISTS idx_payments_user ON public.payments(user_id);
  CREATE INDEX IF NOT EXISTS idx_notifications_user_status ON public.notifications(user_id, status);

  RETURN 'Tables created successfully';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get table statistics
CREATE OR REPLACE FUNCTION public.get_table_stats()
RETURNS json AS $$
DECLARE
  result json;
BEGIN
  SELECT json_object_agg(table_name, row_count) INTO result
  FROM (
    SELECT 'profiles' as table_name, COUNT(*) as row_count FROM public.profiles
    UNION ALL
    SELECT 'trucks' as table_name, COUNT(*) as row_count FROM public.trucks
    UNION ALL
    SELECT 'trips' as table_name, COUNT(*) as row_count FROM public.trips
    UNION ALL
    SELECT 'contracts' as table_name, COUNT(*) as row_count FROM public.contracts
    UNION ALL
    SELECT 'payments' as table_name, COUNT(*) as row_count FROM public.payments
    UNION ALL
    SELECT 'notifications' as table_name, COUNT(*) as row_count FROM public.notifications
    UNION ALL
    SELECT 'maintenance_requests' as table_name, COUNT(*) as row_count FROM public.maintenance_requests
  ) stats;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.create_profiles_table() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.get_table_stats() TO authenticated, anon;
