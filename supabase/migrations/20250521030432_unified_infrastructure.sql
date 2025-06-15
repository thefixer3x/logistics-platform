-- Unified Schema Organization Migration
-- This migration organizes existing data into the new unified schema structure
-- Run this after backing up your existing data

-- ============================================================================
-- CREATE SCHEMAS FOR ORGANIZATION
-- ============================================================================

-- Create custom schemas for better organization (if they don't exist)
CREATE SCHEMA IF NOT EXISTS logistics;
CREATE SCHEMA IF NOT EXISTS payments;
CREATE SCHEMA IF NOT EXISTS monitoring;
CREATE SCHEMA IF NOT EXISTS reporting;

-- ============================================================================
-- MIGRATE EXISTING TABLES TO NEW SCHEMA STRUCTURE
-- ============================================================================

-- Check if tables exist in public schema and move/rename them
DO $$
BEGIN
  -- Migrate profiles table (likely already exists in public)
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
    -- Add any missing columns to existing profiles table
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS company_name VARCHAR;
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status VARCHAR CHECK (status IN ('active', 'inactive', 'suspended')) DEFAULT 'active';
    ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS metadata JSONB;
    
    -- Create view in logistics schema pointing to public.profiles
    CREATE OR REPLACE VIEW logistics.profiles AS SELECT * FROM public.profiles;
  ELSE
    -- Create profiles table in logistics schema
    CREATE TABLE logistics.profiles (
      id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
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
  END IF;

  -- Migrate trucks table
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'trucks') THEN
    -- Create view in logistics schema
    CREATE OR REPLACE VIEW logistics.trucks AS SELECT * FROM public.trucks;
  END IF;

  -- Migrate trips table
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'trips') THEN
    CREATE OR REPLACE VIEW logistics.trips AS SELECT * FROM public.trips;
  END IF;

  -- Migrate contracts table
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'contracts') THEN
    CREATE OR REPLACE VIEW logistics.contracts AS SELECT * FROM public.contracts;
  END IF;

  -- Move payments to payments schema
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'payments') THEN
    CREATE OR REPLACE VIEW payments.payments AS SELECT * FROM public.payments;
  END IF;

  -- Move notifications to logistics schema
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
    CREATE OR REPLACE VIEW logistics.notifications AS SELECT * FROM public.notifications;
  END IF;
END $$;

-- ============================================================================
-- CREATE NEW TABLES FOR UNIFIED INFRASTRUCTURE
-- ============================================================================

-- Truck locations for real-time tracking
CREATE TABLE IF NOT EXISTS logistics.truck_locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed DECIMAL(5,2),
  heading INTEGER,
  altitude DECIMAL(8,2),
  accuracy DECIMAL(8,2),
  battery_level INTEGER,
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Route optimization data
CREATE TABLE IF NOT EXISTS logistics.route_optimization (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID NOT NULL,
  route_data JSONB NOT NULL,
  optimization_score DECIMAL(5,2),
  estimated_fuel_savings DECIMAL(10,2),
  estimated_time_savings INTEGER,
  status VARCHAR CHECK (status IN ('draft', 'active', 'completed')) DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Predictive maintenance
CREATE TABLE IF NOT EXISTS logistics.predictive_maintenance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  truck_id UUID NOT NULL,
  component VARCHAR NOT NULL,
  health_score DECIMAL(5,2) NOT NULL,
  predicted_failure_date DATE,
  maintenance_priority VARCHAR CHECK (maintenance_priority IN ('low', 'medium', 'high', 'critical')) DEFAULT 'medium',
  ai_confidence DECIMAL(5,2),
  sensor_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment schedules
CREATE TABLE IF NOT EXISTS payments.payment_schedules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL,
  driver_id UUID NOT NULL,
  schedule_type VARCHAR CHECK (schedule_type IN ('daily', 'weekly', 'monthly')) DEFAULT 'daily',
  amount DECIMAL(12,2) NOT NULL,
  due_date DATE NOT NULL,
  status VARCHAR CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'overdue')) DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Payment analytics
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
  average_payment_time DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- System health monitoring
CREATE TABLE IF NOT EXISTS monitoring.system_health (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  service_name VARCHAR NOT NULL,
  status VARCHAR CHECK (status IN ('healthy', 'degraded', 'down')) DEFAULT 'healthy',
  response_time DECIMAL(8,3),
  error_rate DECIMAL(5,2),
  cpu_usage DECIMAL(5,2),
  memory_usage DECIMAL(5,2),
  disk_usage DECIMAL(5,2),
  active_connections INTEGER,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs
CREATE TABLE IF NOT EXISTS monitoring.audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action VARCHAR NOT NULL,
  resource_type VARCHAR NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SLA metrics
CREATE TABLE IF NOT EXISTS reporting.sla_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  contract_id UUID NOT NULL,
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

-- Performance dashboards
CREATE TABLE IF NOT EXISTS reporting.performance_dashboards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  dashboard_type VARCHAR NOT NULL,
  user_id UUID NOT NULL,
  config JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================

-- Truck location indexes
CREATE INDEX IF NOT EXISTS idx_truck_locations_truck_time ON logistics.truck_locations(truck_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_truck_locations_geo ON logistics.truck_locations USING GIST(ST_Point(longitude, latitude));

-- Route optimization indexes
CREATE INDEX IF NOT EXISTS idx_route_optimization_truck ON logistics.route_optimization(truck_id, status);

-- Predictive maintenance indexes
CREATE INDEX IF NOT EXISTS idx_predictive_maintenance_truck ON logistics.predictive_maintenance(truck_id, maintenance_priority);
CREATE INDEX IF NOT EXISTS idx_predictive_maintenance_date ON logistics.predictive_maintenance(predicted_failure_date);

-- Payment schedule indexes
CREATE INDEX IF NOT EXISTS idx_payment_schedules_due ON payments.payment_schedules(due_date, status);
CREATE INDEX IF NOT EXISTS idx_payment_schedules_driver ON payments.payment_schedules(driver_id, status);

-- Monitoring indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_action ON monitoring.audit_logs(user_id, action, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_system_health_service ON monitoring.system_health(service_name, created_at DESC);

-- Reporting indexes
CREATE INDEX IF NOT EXISTS idx_sla_metrics_contract_period ON reporting.sla_metrics(contract_id, period_start, period_end);

-- ============================================================================
-- CREATE FUNCTIONS FOR UNIFIED OPERATIONS
-- ============================================================================

-- Function to calculate SLA compliance
CREATE OR REPLACE FUNCTION reporting.calculate_sla_compliance(
  contract_id_param UUID DEFAULT NULL,
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
    AND (contract_id_param IS NULL OR t.contract_id = contract_id_param)
  GROUP BY t.contract_id;
END;
$$ LANGUAGE plpgsql;

-- Function for fleet status
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

-- Function for processing daily allowances
CREATE OR REPLACE FUNCTION payments.process_daily_allowances()
RETURNS INTEGER AS $$
DECLARE
  processed_count INTEGER := 0;
  driver_record RECORD;
BEGIN
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
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

-- Enable RLS on new tables
ALTER TABLE logistics.truck_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics.route_optimization ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics.predictive_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments.payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments.payment_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring.system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE reporting.sla_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE reporting.performance_dashboards ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- CREATE COMPREHENSIVE VIEWS FOR UNIFIED ACCESS
-- ============================================================================

-- Fleet overview with real-time data
CREATE OR REPLACE VIEW logistics.fleet_overview AS
SELECT 
  t.id,
  t.license_plate,
  t.make,
  t.model,
  t.status,
  d.first_name || ' ' || d.last_name as driver_name,
  c.first_name || ' ' || c.last_name as contractor_name,
  tl.latitude,
  tl.longitude,
  tl.recorded_at as last_location_update,
  pm.health_score as overall_health,
  COUNT(tr.id) as active_trips
FROM logistics.trucks t
LEFT JOIN logistics.profiles d ON d.id = t.driver_id
LEFT JOIN logistics.profiles c ON c.id = t.contractor_id
LEFT JOIN LATERAL (
  SELECT latitude, longitude, recorded_at
  FROM logistics.truck_locations 
  WHERE truck_id = t.id 
  ORDER BY recorded_at DESC 
  LIMIT 1
) tl ON true
LEFT JOIN LATERAL (
  SELECT AVG(health_score) as health_score
  FROM logistics.predictive_maintenance 
  WHERE truck_id = t.id
) pm ON true
LEFT JOIN logistics.trips tr ON tr.truck_id = t.id AND tr.status = 'in_progress'
GROUP BY t.id, t.license_plate, t.make, t.model, t.status, d.first_name, d.last_name, 
         c.first_name, c.last_name, tl.latitude, tl.longitude, tl.recorded_at, pm.health_score;

-- Financial summary view
CREATE OR REPLACE VIEW payments.financial_summary AS
SELECT 
  DATE_TRUNC('month', created_at) as month,
  SUM(CASE WHEN payment_type = 'trip_payment' THEN amount ELSE 0 END) as trip_revenue,
  SUM(CASE WHEN payment_type = 'daily_allowance' THEN amount ELSE 0 END) as allowance_payments,
  SUM(CASE WHEN payment_type = 'maintenance' THEN amount ELSE 0 END) as maintenance_costs,
  SUM(CASE WHEN payment_type = 'fuel' THEN amount ELSE 0 END) as fuel_costs,
  COUNT(*) as total_transactions,
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) as avg_processing_days
FROM payments.payments
WHERE status = 'completed'
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Insert sample data to test the unified infrastructure
INSERT INTO monitoring.system_health (service_name, status, response_time, error_rate)
VALUES 
  ('api-gateway', 'healthy', 45.2, 0.1),
  ('payment-service', 'healthy', 120.5, 0.0),
  ('tracking-service', 'healthy', 32.8, 0.2),
  ('notification-service', 'healthy', 67.3, 0.0);

-- Log this migration
INSERT INTO monitoring.audit_logs (action, resource_type, resource_id, new_values)
VALUES ('schema_migration', 'database', gen_random_uuid(), '{"migration": "unified_infrastructure", "timestamp": "' || NOW() || '"}');

COMMENT ON SCHEMA logistics IS 'Core logistics operations including trucks, trips, drivers, and routes';
COMMENT ON SCHEMA payments IS 'Payment processing, schedules, and financial analytics';
COMMENT ON SCHEMA monitoring IS 'System health monitoring and audit logging';
COMMENT ON SCHEMA reporting IS 'SLA metrics, compliance tracking, and performance dashboards';
