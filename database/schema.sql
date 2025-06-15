-- SefTech Logistics Platform - Unified Database Schema
-- Project: mxtsdgkwzjzlttpotole.supabase.co
-- Run this SQL in your Supabase SQL editor

-- ============================================================================
-- UNIFIED SCHEMA CONFIGURATION
-- ============================================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis" SCHEMA public;

-- Create custom schemas for better organization
CREATE SCHEMA IF NOT EXISTS logistics;
CREATE SCHEMA IF NOT EXISTS payments;
CREATE SCHEMA IF NOT EXISTS monitoring;
CREATE SCHEMA IF NOT EXISTS reporting;

-- Set search path to include all schemas
ALTER DATABASE postgres SET search_path = public, logistics, payments, monitoring, reporting;

-- Enable RLS (Row Level Security) globally
ALTER DATABASE postgres SET row_security = on;

-- ============================================================================
-- CORE TABLES (public schema)
-- ============================================================================

-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.jwt_secret" TO 'your-jwt-secret';

-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  first_name VARCHAR,
  last_name VARCHAR,
  phone VARCHAR,
  role VARCHAR CHECK (role IN ('driver', 'supervisor', 'contractor', 'admin')) DEFAULT 'driver',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trucks table
CREATE TABLE IF NOT EXISTS trucks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  license_plate VARCHAR NOT NULL UNIQUE,
  make VARCHAR NOT NULL,
  model VARCHAR NOT NULL,
  year INTEGER NOT NULL,
  status VARCHAR CHECK (status IN ('active', 'maintenance', 'inactive')) DEFAULT 'active',
  driver_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  maintenance_due_date DATE,
  last_maintenance_date DATE,
  odometer_reading INTEGER DEFAULT 0,
  fuel_capacity DECIMAL(10,2),
  payload_capacity DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trips table
CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES trucks(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contract_id UUID REFERENCES contracts(id) ON DELETE SET NULL,
  origin VARCHAR NOT NULL,
  destination VARCHAR NOT NULL,
  status VARCHAR CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  distance DECIMAL(10,2),
  fuel_used DECIMAL(10,2),
  payment_amount DECIMAL(12,2),
  payment_status VARCHAR CHECK (payment_status IN ('pending', 'paid', 'overdue')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contracts table
CREATE TABLE IF NOT EXISTS contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number VARCHAR NOT NULL UNIQUE,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  client_name VARCHAR NOT NULL,
  client_contact VARCHAR,
  description TEXT NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  status VARCHAR CHECK (status IN ('draft', 'pending', 'active', 'completed', 'cancelled')) DEFAULT 'draft',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  weekly_target_trips INTEGER DEFAULT 20,
  completion_bonus DECIMAL(12,2) DEFAULT 0,
  penalty_rate DECIMAL(5,2) DEFAULT 0,
  terms_and_conditions TEXT,
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create maintenance_requests table
CREATE TABLE IF NOT EXISTS maintenance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES trucks(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  supervisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type VARCHAR CHECK (type IN ('routine', 'repair', 'emergency')) NOT NULL,
  description TEXT NOT NULL,
  estimated_cost DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  status VARCHAR CHECK (status IN ('pending', 'approved', 'rejected', 'in_progress', 'completed')) DEFAULT 'pending',
  priority VARCHAR CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  approved_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES trips(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  contractor_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR CHECK (type IN ('trip_payment', 'bonus', 'feeding_allowance', 'penalty')) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  payment_method VARCHAR,
  reference_number VARCHAR,
  description TEXT,
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR CHECK (type IN ('info', 'warning', 'error', 'success')) DEFAULT 'info',
  category VARCHAR CHECK (category IN ('trip', 'payment', 'maintenance', 'contract', 'system')),
  read_at TIMESTAMP WITH TIME ZONE,
  action_url VARCHAR,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create truck_locations table for real-time tracking
CREATE TABLE IF NOT EXISTS truck_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES trucks(id) ON DELETE CASCADE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5,2),
  heading INTEGER,
  altitude DECIMAL(8,2),
  accuracy DECIMAL(8,2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create incidents table
CREATE TABLE IF NOT EXISTS incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES trucks(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  supervisor_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  type VARCHAR CHECK (type IN ('accident', 'breakdown', 'traffic_violation', 'theft', 'other')) NOT NULL,
  severity VARCHAR CHECK (severity IN ('minor', 'moderate', 'major', 'critical')) DEFAULT 'minor',
  description TEXT NOT NULL,
  location VARCHAR,
  status VARCHAR CHECK (status IN ('reported', 'investigating', 'resolved', 'closed')) DEFAULT 'reported',
  resolution TEXT,
  cost DECIMAL(12,2),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- ADDITIONAL TABLES (logistics schema)
-- ============================================================================

-- Create logistics.trips table
CREATE TABLE IF NOT EXISTS logistics.trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES logistics.trucks(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  contract_id UUID REFERENCES logistics.contracts(id) ON DELETE SET NULL,
  origin VARCHAR NOT NULL,
  destination VARCHAR NOT NULL,
  status VARCHAR CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')) DEFAULT 'pending',
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  distance DECIMAL(10,2),
  fuel_used DECIMAL(10,2),
  payment_amount DECIMAL(12,2),
  payment_status VARCHAR CHECK (payment_status IN ('pending', 'paid', 'overdue')) DEFAULT 'pending',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create logistics.contracts table
CREATE TABLE IF NOT EXISTS logistics.contracts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_number VARCHAR NOT NULL UNIQUE,
  contractor_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  client_name VARCHAR NOT NULL,
  client_contact VARCHAR,
  description TEXT NOT NULL,
  value DECIMAL(15,2) NOT NULL,
  status VARCHAR CHECK (status IN ('draft', 'pending', 'active', 'completed', 'cancelled')) DEFAULT 'draft',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  weekly_target_trips INTEGER DEFAULT 20,
  completion_bonus DECIMAL(12,2) DEFAULT 0,
  penalty_rate DECIMAL(5,2) DEFAULT 0,
  terms_and_conditions TEXT,
  signed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create logistics.maintenance_requests table
CREATE TABLE IF NOT EXISTS logistics.maintenance_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES logistics.trucks(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  supervisor_id UUID REFERENCES logistics.profiles(id) ON DELETE SET NULL,
  type VARCHAR CHECK (type IN ('routine', 'repair', 'emergency')) NOT NULL,
  description TEXT NOT NULL,
  estimated_cost DECIMAL(12,2),
  actual_cost DECIMAL(12,2),
  status VARCHAR CHECK (status IN ('pending', 'approved', 'rejected', 'in_progress', 'completed')) DEFAULT 'pending',
  priority VARCHAR CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  approved_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create logistics.payments table
CREATE TABLE IF NOT EXISTS logistics.payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES logistics.trips(id) ON DELETE CASCADE,
  driver_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  contractor_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR CHECK (type IN ('trip_payment', 'bonus', 'feeding_allowance', 'penalty')) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  status VARCHAR CHECK (status IN ('pending', 'processing', 'completed', 'failed')) DEFAULT 'pending',
  payment_method VARCHAR,
  reference_number VARCHAR,
  description TEXT,
  due_date DATE,
  paid_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create logistics.notifications table
CREATE TABLE IF NOT EXISTS logistics.notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR NOT NULL,
  message TEXT NOT NULL,
  type VARCHAR CHECK (type IN ('info', 'warning', 'error', 'success')) DEFAULT 'info',
  category VARCHAR CHECK (category IN ('trip', 'payment', 'maintenance', 'contract', 'system')),
  read_at TIMESTAMP WITH TIME ZONE,
  action_url VARCHAR,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create logistics.truck_locations table for real-time tracking
CREATE TABLE IF NOT EXISTS logistics.truck_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES logistics.trucks(id) ON DELETE CASCADE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5,2),
  heading INTEGER,
  altitude DECIMAL(8,2),
  accuracy DECIMAL(8,2),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create logistics.incidents table
CREATE TABLE IF NOT EXISTS logistics.incidents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES logistics.trucks(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  supervisor_id UUID REFERENCES logistics.profiles(id) ON DELETE SET NULL,
  type VARCHAR CHECK (type IN ('accident', 'breakdown', 'traffic_violation', 'theft', 'other')) NOT NULL,
  severity VARCHAR CHECK (severity IN ('minor', 'moderate', 'major', 'critical')) DEFAULT 'minor',
  description TEXT NOT NULL,
  location VARCHAR,
  status VARCHAR CHECK (status IN ('reported', 'investigating', 'resolved', 'closed')) DEFAULT 'reported',
  resolution TEXT,
  cost DECIMAL(12,2),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- MONITORING TABLES (monitoring schema)
-- ============================================================================

-- Create monitoring.truck_speed table
CREATE TABLE IF NOT EXISTS monitoring.truck_speed (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES logistics.trucks(id) ON DELETE CASCADE NOT NULL,
  speed DECIMAL(5,2) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create monitoring.truck_location_history table
CREATE TABLE IF NOT EXISTS monitoring.truck_location_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES logistics.trucks(id) ON DELETE CASCADE NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- REPORTING TABLES (reporting schema)
-- ============================================================================

-- Create reporting.trip_summary table
CREATE TABLE IF NOT EXISTS reporting.trip_summary (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES logistics.trips(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  contractor_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_distance DECIMAL(10,2) NOT NULL,
  total_fuel DECIMAL(10,2) NOT NULL,
  total_payment DECIMAL(12,2) NOT NULL,
  status VARCHAR CHECK (status IN ('completed', 'in_progress', 'cancelled')) DEFAULT 'completed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reporting.driver_performance table
CREATE TABLE IF NOT EXISTS reporting.driver_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  driver_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  total_trips INTEGER DEFAULT 0,
  total_distance DECIMAL(10,2) DEFAULT 0,
  total_fuel DECIMAL(10,2) DEFAULT 0,
  total_payment DECIMAL(12,2) DEFAULT 0,
  rating DECIMAL(3,2) CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create reporting.contract_performance table
CREATE TABLE IF NOT EXISTS reporting.contract_performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES logistics.contracts(id) ON DELETE CASCADE NOT NULL,
  total_trips INTEGER DEFAULT 0,
  total_distance DECIMAL(10,2) DEFAULT 0,
  total_fuel DECIMAL(10,2) DEFAULT 0,
  total_payment DECIMAL(12,2) DEFAULT 0,
  status VARCHAR CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- SCHEMA-SPECIFIC TABLES AND FUNCTIONS
-- ============================================================================

-- Logistics Schema Extensions
CREATE TABLE IF NOT EXISTS logistics.route_optimization (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES logistics.trucks(id) ON DELETE CASCADE NOT NULL,
  route_data JSONB NOT NULL,
  optimization_score DECIMAL(5,2),
  estimated_fuel_savings DECIMAL(10,2),
  estimated_time_savings INTEGER, -- minutes
  status VARCHAR CHECK (status IN ('draft', 'active', 'completed')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS logistics.predictive_maintenance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID REFERENCES logistics.trucks(id) ON DELETE CASCADE NOT NULL,
  component VARCHAR NOT NULL,
  health_score DECIMAL(5,2) NOT NULL, -- 0-100
  predicted_failure_date DATE,
  maintenance_priority VARCHAR CHECK (maintenance_priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  ai_confidence DECIMAL(5,2),
  sensor_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payments Schema Extensions  
CREATE TABLE IF NOT EXISTS payments.payment_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES logistics.contracts(id) ON DELETE CASCADE NOT NULL,
  driver_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  schedule_type VARCHAR CHECK (schedule_type IN ('daily', 'weekly', 'monthly')) DEFAULT 'daily',
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'overdue')) DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS payments.payment_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  total_revenue DECIMAL(15,2),
  total_expenses DECIMAL(15,2),
  driver_payments DECIMAL(15,2),
  maintenance_costs DECIMAL(15,2),
  fuel_costs DECIMAL(15,2),
  profit_margin DECIMAL(5,2),
  payment_delays_count INTEGER DEFAULT 0,
  average_payment_time DECIMAL(5,2), -- days
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Monitoring Schema Extensions
CREATE TABLE IF NOT EXISTS monitoring.system_health (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name VARCHAR NOT NULL,
  status VARCHAR CHECK (status IN ('healthy', 'degraded', 'down')) DEFAULT 'healthy',
  response_time DECIMAL(8,3), -- milliseconds
  error_rate DECIMAL(5,2), -- percentage
  cpu_usage DECIMAL(5,2),
  memory_usage DECIMAL(5,2),
  disk_usage DECIMAL(5,2),
  active_connections INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS monitoring.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES logistics.profiles(id) ON DELETE SET NULL,
  action VARCHAR NOT NULL,
  resource_type VARCHAR NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Reporting Schema Extensions
CREATE TABLE IF NOT EXISTS reporting.sla_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID REFERENCES logistics.contracts(id) ON DELETE CASCADE NOT NULL,
  metric_type VARCHAR NOT NULL,
  target_value DECIMAL(10,2),
  actual_value DECIMAL(10,2),
  compliance_percentage DECIMAL(5,2),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  status VARCHAR CHECK (status IN ('compliant', 'warning', 'breach')) DEFAULT 'compliant',
  penalties DECIMAL(12,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS reporting.performance_dashboards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dashboard_type VARCHAR NOT NULL,
  user_id UUID REFERENCES logistics.profiles(id) ON DELETE CASCADE NOT NULL,
  config JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- UNIFIED FUNCTIONS AND PROCEDURES
-- ============================================================================

-- Function to calculate SLA compliance across all contracts
CREATE OR REPLACE FUNCTION reporting.calculate_sla_compliance(
  contract_id UUID DEFAULT NULL,
  start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
  end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
  contract_id UUID,
  on_time_deliveries INTEGER,
  total_deliveries INTEGER,
  compliance_rate DECIMAL(5,2),
  penalties DECIMAL(12,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    t.contract_id,
    COUNT(CASE WHEN t.actual_delivery <= t.scheduled_delivery THEN 1 END)::INTEGER as on_time_deliveries,
    COUNT(*)::INTEGER as total_deliveries,
    ROUND(
      (COUNT(CASE WHEN t.actual_delivery <= t.scheduled_delivery THEN 1 END)::DECIMAL / COUNT(*)) * 100, 
      2
    ) as compliance_rate,
    COALESCE(SUM(sm.penalties), 0) as penalties
  FROM logistics.trips t
  LEFT JOIN reporting.sla_metrics sm ON sm.contract_id = t.contract_id 
    AND sm.period_start >= start_date 
    AND sm.period_end <= end_date
  WHERE t.status = 'completed'
    AND t.completed_at >= start_date
    AND t.completed_at <= end_date
    AND (calculate_sla_compliance.contract_id IS NULL OR t.contract_id = calculate_sla_compliance.contract_id)
  GROUP BY t.contract_id;
END;
$$ LANGUAGE plpgsql;

-- Function for real-time fleet monitoring
CREATE OR REPLACE FUNCTION logistics.get_fleet_status()
RETURNS TABLE (
  total_trucks INTEGER,
  active_trucks INTEGER,
  maintenance_trucks INTEGER,
  trips_in_progress INTEGER,
  average_utilization DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_trucks,
    COUNT(CASE WHEN status = 'active' THEN 1 END)::INTEGER as active_trucks,
    COUNT(CASE WHEN status = 'maintenance' THEN 1 END)::INTEGER as maintenance_trucks,
    (SELECT COUNT(*)::INTEGER FROM logistics.trips WHERE status = 'in_progress') as trips_in_progress,
    ROUND(
      (COUNT(CASE WHEN status = 'active' THEN 1 END)::DECIMAL / COUNT(*)) * 100, 
      2
    ) as average_utilization
  FROM logistics.trucks;
END;
$$ LANGUAGE plpgsql;

-- Function for payment processing with MOU compliance
CREATE OR REPLACE FUNCTION payments.process_daily_allowances()
RETURNS INTEGER AS $$
DECLARE
  processed_count INTEGER := 0;
  driver_record RECORD;
BEGIN
  -- Process ₦5,000 daily allowances for active drivers
  FOR driver_record IN 
    SELECT DISTINCT p.id, p.first_name, p.last_name, c.id as contract_id
    FROM logistics.profiles p
    JOIN logistics.trucks t ON t.driver_id = p.id
    JOIN logistics.contracts c ON c.contractor_id = p.id OR c.driver_id = p.id
    WHERE p.role = 'driver' 
    AND t.status = 'active'
    AND EXISTS (
      SELECT 1 FROM logistics.trips tr 
      WHERE tr.driver_id = p.id 
      AND tr.status = 'in_progress'
      AND DATE(tr.started_at) = CURRENT_DATE
    )
  LOOP
    INSERT INTO payments.payments (
      user_id,
      contract_id,
      amount,
      payment_type,
      payment_method,
      status,
      description
    ) VALUES (
      driver_record.id,
      driver_record.contract_id,
      5000.00,
      'daily_allowance',
      'bank_transfer',
      'pending',
      'Daily allowance for active duty - ' || CURRENT_DATE
    );
    
    processed_count := processed_count + 1;
  END LOOP;
  
  RETURN processed_count;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- REAL-TIME SUBSCRIPTIONS AND TRIGGERS
-- ============================================================================

-- Trigger for real-time location updates
CREATE OR REPLACE FUNCTION logistics.notify_location_update()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify(
    'truck_location_update',
    json_build_object(
      'truck_id', NEW.truck_id,
      'latitude', NEW.latitude,
      'longitude', NEW.longitude,
      'timestamp', NEW.recorded_at
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER truck_location_update_trigger
  AFTER INSERT ON logistics.truck_locations
  FOR EACH ROW EXECUTE FUNCTION logistics.notify_location_update();

-- Trigger for SLA breach notifications
CREATE OR REPLACE FUNCTION reporting.check_sla_breach()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.actual_delivery > NEW.scheduled_delivery THEN
    INSERT INTO logistics.notifications (
      user_id,
      title,
      message,
      type,
      category
    ) 
    SELECT 
      c.contractor_id,
      'SLA Breach Alert',
      'Trip ' || NEW.id || ' delivered late. Scheduled: ' || NEW.scheduled_delivery || ', Actual: ' || NEW.actual_delivery,
      'warning',
      'contract'
    FROM logistics.contracts c 
    WHERE c.id = NEW.contract_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER sla_breach_check_trigger
  AFTER UPDATE ON logistics.trips
  FOR EACH ROW 
  WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
  EXECUTE FUNCTION reporting.check_sla_breach();

-- ============================================================================
-- INDEXES AND CONSTRAINTS
-- ============================================================================

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_trucks_status ON trucks(status);
CREATE INDEX IF NOT EXISTS idx_trucks_contractor ON trucks(contractor_id);
CREATE INDEX IF NOT EXISTS idx_trips_status ON trips(status);
CREATE INDEX IF NOT EXISTS idx_trips_driver ON trips(driver_id);
CREATE INDEX IF NOT EXISTS idx_trips_truck ON trips(truck_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read_at);
CREATE INDEX IF NOT EXISTS idx_truck_locations_truck ON truck_locations(truck_id);
CREATE INDEX IF NOT EXISTS idx_truck_locations_timestamp ON truck_locations(timestamp);

-- Logistics indexes
CREATE INDEX IF NOT EXISTS idx_trucks_driver_status ON logistics.trucks(driver_id, status);
CREATE INDEX IF NOT EXISTS idx_trips_driver_status ON logistics.trips(driver_id, status);
CREATE INDEX IF NOT EXISTS idx_trips_contract_dates ON logistics.trips(contract_id, scheduled_delivery, actual_delivery);
CREATE INDEX IF NOT EXISTS idx_truck_locations_truck_time ON logistics.truck_locations(truck_id, recorded_at DESC);

-- Payments indexes
CREATE INDEX IF NOT EXISTS idx_payments_user_status ON payments.payments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_payments_contract_date ON payments.payments(contract_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_due ON payments.payment_schedules(due_date, status);

-- Monitoring indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON monitoring.audit_logs(user_id, action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_health_service ON monitoring.system_health(service_name, created_at DESC);

-- Reporting indexes
CREATE INDEX IF NOT EXISTS idx_sla_metrics_contract_period ON reporting.sla_metrics(contract_id, period_start, period_end);

-- Geospatial indexes for truck locations
CREATE INDEX IF NOT EXISTS idx_truck_locations_geo ON logistics.truck_locations USING GIST(ST_Point(longitude, latitude));

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE trucks ENABLE ROW LEVEL SECURITY;
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE truck_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Profiles: Users can read their own profile, admins can read all
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trucks: Contractors can manage their trucks, drivers can view assigned trucks
CREATE POLICY "Contractors can manage their trucks" ON trucks
  FOR ALL USING (
    contractor_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  );

CREATE POLICY "Drivers can view assigned trucks" ON trucks
  FOR SELECT USING (
    driver_id = auth.uid() OR
    contractor_id = auth.uid() OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('supervisor', 'admin'))
  );

-- Trips: Drivers can view their trips, contractors can view all their trucks' trips
CREATE POLICY "Drivers can view their trips" ON trips
  FOR SELECT USING (
    driver_id = auth.uid() OR
    truck_id IN (SELECT id FROM trucks WHERE contractor_id = auth.uid()) OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('supervisor', 'admin'))
  );

CREATE POLICY "Authorized users can manage trips" ON trips
  FOR ALL USING (
    driver_id = auth.uid() OR
    truck_id IN (SELECT id FROM trucks WHERE contractor_id = auth.uid()) OR
    auth.uid() IN (SELECT id FROM profiles WHERE role IN ('supervisor', 'admin'))
  );

-- Notifications: Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert notifications" ON notifications
  FOR INSERT WITH CHECK (true);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_trucks_updated_at BEFORE UPDATE ON trucks FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_trips_updated_at BEFORE UPDATE ON trips FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_contracts_updated_at BEFORE UPDATE ON contracts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_maintenance_requests_updated_at BEFORE UPDATE ON maintenance_requests FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON incidents FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, last_name)
  VALUES (NEW.id, NEW.email, NEW.raw_user_meta_data->>'first_name', NEW.raw_user_meta_data->>'last_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Create sample data (optional)
-- You can uncomment and modify these to add test data

/*
-- Insert sample contractor
INSERT INTO profiles (id, email, first_name, last_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440000', 'contractor@seftech.com', 'John', 'Contractor', 'contractor');

-- Insert sample supervisor  
INSERT INTO profiles (id, email, first_name, last_name, role) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'supervisor@seftech.com', 'Jane', 'Supervisor', 'supervisor');

-- Insert sample drivers
INSERT INTO profiles (id, email, first_name, last_name, role, phone) VALUES
('550e8400-e29b-41d4-a716-446655440002', 'driver1@seftech.com', 'Mike', 'Driver', 'driver', '+2348123456789'),
('550e8400-e29b-41d4-a716-446655440003', 'driver2@seftech.com', 'Sarah', 'Driver', 'driver', '+2348123456790');

-- Insert sample trucks
INSERT INTO trucks (license_plate, make, model, year, contractor_id, driver_id) VALUES
('LAG-001-AA', 'Mercedes', 'Actros', 2020, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002'),
('LAG-002-BB', 'Volvo', 'FH16', 2021, '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440003');

-- Insert sample contract
INSERT INTO contracts (contract_number, contractor_id, client_name, description, value, status, start_date, end_date) VALUES
('CTR-2025-001', '550e8400-e29b-41d4-a716-446655440000', 'Lagos State Infrastructure', 'Sand and gravel transportation for road construction', 25000000, 'active', '2025-01-01', '2025-12-31');
*/
