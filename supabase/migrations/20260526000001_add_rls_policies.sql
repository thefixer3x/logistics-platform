-- ============================================================
-- RLS Policies for Core SefTech Tables
-- Created: 2026-05-26 by PER-4 Dynamix Revive
-- Fixes: Tables with RLS enabled but no policies (deny-all state)
-- ============================================================

-- Enable RLS on all target tables first
ALTER TABLE logistics.truck_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics.route_optimization ENABLE ROW LEVEL SECURITY;
ALTER TABLE logistics.predictive_maintenance ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments.payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments.payment_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring.system_health ENABLE ROW LEVEL SECURITY;
ALTER TABLE monitoring.audit_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- LOGISTICS SCHEMA POLICIES
-- ============================================================

-- truck_locations: allow service role full access, authenticated users read all (read-only for drivers)
CREATE POLICY "logistics.truck_locations_service_role_full" ON logistics.truck_locations
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "logistics.truck_locations_authenticated_read" ON logistics.truck_locations
  FOR SELECT TO authenticated USING (true);

-- route_optimization: allow authenticated users read their assigned routes
CREATE POLICY "logistics.route_optimization_service_role_full" ON logistics.route_optimization
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "logistics.route_optimization_authenticated_read" ON logistics.route_optimization
  FOR SELECT TO authenticated USING (true);

-- predictive_maintenance: allow authenticated users read all
CREATE POLICY "logistics.predictive_maintenance_service_role_full" ON logistics.predictive_maintenance
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "logistics.predictive_maintenance_authenticated_read" ON logistics.predictive_maintenance
  FOR SELECT TO authenticated USING (true);

-- ============================================================
-- PAYMENTS SCHEMA POLICIES
-- ============================================================

-- payment_schedules: allow service role full, authenticated users read own
CREATE POLICY "payments.payment_schedules_service_role_full" ON payments.payment_schedules
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "payments.payment_schedules_authenticated_read" ON payments.payment_schedules
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "payments.payment_schedules_authenticated_insert" ON payments.payment_schedules
  FOR INSERT TO authenticated WITH CHECK (true);

-- payment_analytics: read-only for authenticated
CREATE POLICY "payments.payment_analytics_service_role_full" ON payments.payment_analytics
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "payments.payment_analytics_authenticated_read" ON payments.payment_analytics
  FOR SELECT TO authenticated USING (true);

-- ============================================================
-- MONITORING SCHEMA POLICIES
-- ============================================================

-- system_health: read-only for authenticated (system metrics)
CREATE POLICY "monitoring.system_health_service_role_full" ON monitoring.system_health
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "monitoring.system_health_authenticated_read" ON monitoring.system_health
  FOR SELECT TO authenticated USING (true);

-- audit_logs: service role only (sensitive)
CREATE POLICY "monitoring.audit_logs_service_role_full" ON monitoring.audit_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

-- ============================================================
-- PUBLIC SCHEMA POLICIES (basic app data)
-- ============================================================

-- profiles: users can read all, update own
CREATE POLICY "profiles_service_role_full" ON profiles
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "profiles_authenticated_read" ON profiles
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_owner_update" ON profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- VERIFICATION LOGS (for KYC services)
-- ============================================================

CREATE POLICY "verification_logs_service_role_full" ON verification_logs
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "verification_logs_authenticated_read" ON verification_logs
  FOR SELECT TO authenticated USING (true);

-- ============================================================
-- Row Level Security Notes:
-- - service_role bypasses all RLS (use only in server-side code)
-- -authenticated = user with valid Supabase session
-- - anon = public access (no login required)
-- ============================================================
