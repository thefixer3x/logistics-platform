-- Sample Data Insertion for Unified Logistics Platform
-- This script populates the unified infrastructure with realistic test data
-- Run after the unified_infrastructure migration

-- ============================================================================
-- INSERT SAMPLE PROFILES (Users)
-- ============================================================================

-- Sample contractors
INSERT INTO logistics.profiles (id, email, first_name, last_name, phone, role, company_name, status, is_sample_data) VALUES
('11111111-1111-1111-1111-111111111111', 'contractor1@seftech.com', 'Adebayo', 'Okafor', '+234-801-234-5678', 'contractor', 'Lagos Logistics Ltd', 'active', true),
('22222222-2222-2222-2222-222222222222', 'contractor2@seftech.com', 'Chioma', 'Nwosu', '+234-802-345-6789', 'contractor', 'Western Transport Co', 'active', true),
('33333333-3333-3333-3333-333333333333', 'contractor3@seftech.com', 'Ibrahim', 'Mohammed', '+234-803-456-7890', 'contractor', 'Northern Freight Services', 'active', true)
ON CONFLICT (email) DO NOTHING;

-- Sample supervisors
INSERT INTO logistics.profiles (id, email, first_name, last_name, phone, role, status, is_sample_data) VALUES
('44444444-4444-4444-4444-444444444444', 'supervisor1@seftech.com', 'Folake', 'Adeyemi', '+234-805-567-8901', 'supervisor', 'active', true),
('55555555-5555-5555-5555-555555555555', 'supervisor2@seftech.com', 'Emeka', 'Okwu', '+234-806-678-9012', 'supervisor', 'active', true),
('66666666-6666-6666-6666-666666666666', 'admin@seftech.com', 'Kemi', 'Balogun', '+234-807-789-0123', 'admin', 'active', true)
ON CONFLICT (email) DO NOTHING;

-- Sample drivers
INSERT INTO logistics.profiles (id, email, first_name, last_name, phone, role, status, is_sample_data) VALUES
('77777777-7777-7777-7777-777777777777', 'driver1@seftech.com', 'Musa', 'Abdullahi', '+234-811-111-1111', 'driver', 'active', true),
('88888888-8888-8888-8888-888888888888', 'driver2@seftech.com', 'Tunde', 'Olayiwola', '+234-812-222-2222', 'driver', 'active', true),
('99999999-9999-9999-9999-999999999999', 'driver3@seftech.com', 'Ngozi', 'Eze', '+234-813-333-3333', 'driver', 'active', true),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'driver4@seftech.com', 'Yakubu', 'Garba', '+234-814-444-4444', 'driver', 'active', true),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'driver5@seftech.com', 'Amina', 'Yusuf', '+234-815-555-5555', 'driver', 'active', true),
('cccccccc-cccc-cccc-cccc-cccccccccccc', 'driver6@seftech.com', 'Segun', 'Adesanya', '+234-816-666-6666', 'driver', 'active', true)
ON CONFLICT (email) DO NOTHING;

-- ============================================================================
-- INSERT SAMPLE TRUCKS
-- ============================================================================

DO $$
DECLARE
  contractor1_id UUID;
  contractor2_id UUID;
  contractor3_id UUID;
  driver1_id UUID;
  driver2_id UUID;
  driver3_id UUID;
  driver4_id UUID;
  driver5_id UUID;
  driver6_id UUID;
BEGIN
  -- Get contractor IDs
  SELECT id INTO contractor1_id FROM logistics.profiles WHERE email = 'contractor1@seftech.com';
  SELECT id INTO contractor2_id FROM logistics.profiles WHERE email = 'contractor2@seftech.com';
  SELECT id INTO contractor3_id FROM logistics.profiles WHERE email = 'contractor3@seftech.com';
  
  -- Get driver IDs
  SELECT id INTO driver1_id FROM logistics.profiles WHERE email = 'driver1@seftech.com';
  SELECT id INTO driver2_id FROM logistics.profiles WHERE email = 'driver2@seftech.com';
  SELECT id INTO driver3_id FROM logistics.profiles WHERE email = 'driver3@seftech.com';
  SELECT id INTO driver4_id FROM logistics.profiles WHERE email = 'driver4@seftech.com';
  SELECT id INTO driver5_id FROM logistics.profiles WHERE email = 'driver5@seftech.com';
  SELECT id INTO driver6_id FROM logistics.profiles WHERE email = 'driver6@seftech.com';

  -- Insert trucks (using views or direct table access)
  INSERT INTO logistics.trucks (license_plate, make, model, year, status, driver_id, contractor_id, odometer_reading, fuel_capacity, payload_capacity) VALUES
  ('ABC-123-XY', 'Mercedes-Benz', 'Actros', 2020, 'active', driver1_id, contractor1_id, 125000, 400, 25000),
  ('DEF-456-XY', 'Volvo', 'FH16', 2019, 'active', driver2_id, contractor1_id, 89000, 380, 23000),
  ('GHI-789-XY', 'Scania', 'R450', 2021, 'active', driver3_id, contractor2_id, 45000, 420, 26000),
  ('JKL-012-XY', 'MAN', 'TGX', 2018, 'maintenance', NULL, contractor2_id, 156000, 350, 22000),
  ('MNO-345-XY', 'DAF', 'XF', 2020, 'active', driver4_id, contractor3_id, 67000, 390, 24000),
  ('PQR-678-XY', 'Iveco', 'Stralis', 2019, 'active', driver5_id, contractor3_id, 98000, 360, 21000),
  ('STU-901-XY', 'Renault', 'T High', 2021, 'active', driver6_id, contractor1_id, 23000, 400, 25000),
  ('VWX-234-XY', 'Mercedes-Benz', 'Arocs', 2020, 'inactive', NULL, contractor2_id, 112000, 380, 24000);
END $$;

-- ============================================================================
-- INSERT SAMPLE CONTRACTS
-- ============================================================================

DO $$
DECLARE
  contractor1_id UUID;
  contractor2_id UUID;
  contractor3_id UUID;
BEGIN
  SELECT id INTO contractor1_id FROM logistics.profiles WHERE email = 'contractor1@seftech.com';
  SELECT id INTO contractor2_id FROM logistics.profiles WHERE email = 'contractor2@seftech.com';
  SELECT id INTO contractor3_id FROM logistics.profiles WHERE email = 'contractor3@seftech.com';

  INSERT INTO logistics.contracts (contractor_id, contract_type, start_date, end_date, terms, daily_allowance, maintenance_limit, sla_requirements, status) VALUES
  (contractor1_id, 'mou', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '335 days', 
   '{"payment_terms": "Net 30", "fuel_allowance": true, "maintenance_covered": true}', 
   5000.00, 100000.00, 
   '{"on_time_delivery": 95, "vehicle_availability": 90, "maintenance_compliance": 100}', 
   'active'),
  (contractor2_id, 'mou', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '350 days', 
   '{"payment_terms": "Net 15", "fuel_allowance": true, "maintenance_covered": true}', 
   5000.00, 100000.00, 
   '{"on_time_delivery": 95, "vehicle_availability": 90, "maintenance_compliance": 100}', 
   'active'),
  (contractor3_id, 'mou', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '305 days', 
   '{"payment_terms": "Net 30", "fuel_allowance": true, "maintenance_covered": true}', 
   5000.00, 100000.00, 
   '{"on_time_delivery": 95, "vehicle_availability": 90, "maintenance_compliance": 100}', 
   'active');
END $$;

-- ============================================================================
-- INSERT SAMPLE TRIPS
-- ============================================================================

DO $$
DECLARE
  truck_record RECORD;
  contract_record RECORD;
  customer_id UUID := gen_random_uuid();
BEGIN
  -- Create a sample customer
  INSERT INTO logistics.profiles (id, email, first_name, last_name, phone, role, company_name, status) 
  VALUES (customer_id, 'customer@example.com', 'Ade', 'Williams', '+234-820-111-2222', 'admin', 'Sample Customer Ltd', 'active')
  ON CONFLICT (email) DO NOTHING;

  -- Insert sample trips for each active truck
  FOR truck_record IN 
    SELECT t.id as truck_id, t.driver_id, c.id as contract_id
    FROM logistics.trucks t
    JOIN logistics.contracts c ON c.contractor_id = t.contractor_id
    WHERE t.status = 'active' AND t.driver_id IS NOT NULL
  LOOP
    -- Completed trip
    INSERT INTO logistics.trips (
      truck_id, driver_id, customer_id, contract_id,
      origin, destination, 
      status, distance, 
      scheduled_pickup, scheduled_delivery,
      actual_pickup, actual_delivery,
      cargo_type, cargo_weight, cargo_value,
      estimated_cost, actual_cost
    ) VALUES (
      truck_record.truck_id, truck_record.driver_id, customer_id, truck_record.contract_id,
      'Lagos, Nigeria', 'Abuja, Nigeria',
      'completed', 462.3,
      CURRENT_DATE - INTERVAL '2 days' + TIME '08:00:00',
      CURRENT_DATE - INTERVAL '1 day' + TIME '18:00:00',
      CURRENT_DATE - INTERVAL '2 days' + TIME '08:15:00',
      CURRENT_DATE - INTERVAL '1 day' + TIME '17:45:00',
      'Electronics', 15000, 2500000,
      75000, 72000
    );

    -- In-progress trip
    INSERT INTO logistics.trips (
      truck_id, driver_id, customer_id, contract_id,
      origin, destination,
      status, distance,
      scheduled_pickup, scheduled_delivery,
      actual_pickup,
      cargo_type, cargo_weight, cargo_value,
      estimated_cost
    ) VALUES (
      truck_record.truck_id, truck_record.driver_id, customer_id, truck_record.contract_id,
      'Port Harcourt, Nigeria', 'Kano, Nigeria',
      'in_progress', 687.5,
      CURRENT_DATE + TIME '06:00:00',
      CURRENT_DATE + INTERVAL '1 day' + TIME '20:00:00',
      CURRENT_DATE + TIME '06:30:00',
      'Textiles', 18000, 1800000,
      95000
    );
  END LOOP;
END $$;

-- ============================================================================
-- INSERT SAMPLE TRUCK LOCATIONS (Real-time tracking data)
-- ============================================================================

DO $$
DECLARE
  truck_record RECORD;
  location_count INTEGER := 0;
BEGIN
  FOR truck_record IN SELECT id FROM logistics.trucks WHERE status = 'active' LOOP
    -- Insert recent location data (last 24 hours)
    FOR i IN 1..24 LOOP
      INSERT INTO logistics.truck_locations (
        truck_id, latitude, longitude, speed, heading, 
        accuracy, battery_level, recorded_at
      ) VALUES (
        truck_record.id,
        6.5244 + (RANDOM() - 0.5) * 0.1, -- Lagos area coordinates with variation
        3.3792 + (RANDOM() - 0.5) * 0.1,
        40 + RANDOM() * 40, -- Speed between 40-80 km/h
        FLOOR(RANDOM() * 360), -- Random heading
        5 + RANDOM() * 10, -- GPS accuracy
        85 + FLOOR(RANDOM() * 15), -- Battery level 85-100%
        NOW() - INTERVAL '1 hour' * i
      );
      location_count := location_count + 1;
    END LOOP;
  END LOOP;
  
  RAISE NOTICE 'Inserted % location records', location_count;
END $$;

-- ============================================================================
-- INSERT SAMPLE PREDICTIVE MAINTENANCE DATA
-- ============================================================================

DO $$
DECLARE
  truck_record RECORD;
  components TEXT[] := ARRAY['Engine', 'Transmission', 'Brakes', 'Tires', 'Electrical', 'Hydraulics'];
  component TEXT;
BEGIN
  FOR truck_record IN SELECT id FROM logistics.trucks LOOP
    FOREACH component IN ARRAY components LOOP
      INSERT INTO logistics.predictive_maintenance (
        truck_id, component, health_score, 
        predicted_failure_date, maintenance_priority,
        ai_confidence, sensor_data
      ) VALUES (
        truck_record.id,
        component,
        20 + RANDOM() * 80, -- Health score 20-100%
        CURRENT_DATE + INTERVAL '1 day' * (30 + FLOOR(RANDOM() * 60)), -- 30-90 days
        CASE 
          WHEN RANDOM() < 0.1 THEN 'critical'
          WHEN RANDOM() < 0.3 THEN 'high'
          WHEN RANDOM() < 0.7 THEN 'medium'
          ELSE 'low'
        END,
        70 + RANDOM() * 30, -- AI confidence 70-100%
        jsonb_build_object(
          'temperature', 80 + RANDOM() * 40,
          'vibration', RANDOM() * 10,
          'pressure', 100 + RANDOM() * 50
        )
      );
    END LOOP;
  END LOOP;
END $$;

-- ============================================================================
-- INSERT SAMPLE PAYMENT SCHEDULES
-- ============================================================================

DO $$
DECLARE
  driver_record RECORD;
  contract_record RECORD;
BEGIN
  FOR driver_record IN 
    SELECT p.id as driver_id, c.id as contract_id
    FROM logistics.profiles p
    JOIN logistics.trucks t ON t.driver_id = p.id
    JOIN logistics.contracts c ON c.contractor_id = t.contractor_id
    WHERE p.role = 'driver'
  LOOP
    -- Daily allowance schedule for next 30 days
    FOR i IN 1..30 LOOP
      INSERT INTO payments.payment_schedules (
        contract_id, driver_id, schedule_type,
        amount, due_date, status
      ) VALUES (
        driver_record.contract_id, driver_record.driver_id, 'daily',
        5000.00, CURRENT_DATE + i,
        CASE 
          WHEN i <= 7 THEN 'completed'
          WHEN i <= 14 THEN 'processing'
          ELSE 'pending'
        END
      );
    END LOOP;
  END LOOP;
END $$;

-- ============================================================================
-- INSERT SAMPLE PAYMENTS
-- ============================================================================

DO $$
DECLARE
  payment_record RECORD;
BEGIN
  FOR payment_record IN 
    SELECT ps.driver_id, ps.contract_id, ps.amount, ps.due_date
    FROM payments.payment_schedules ps
    WHERE ps.status = 'completed'
  LOOP
    INSERT INTO payments.payments (
      user_id, contract_id, amount, payment_type,
      payment_method, status, description,
      transaction_id, stripe_payment_intent_id
    ) VALUES (
      payment_record.driver_id, payment_record.contract_id, payment_record.amount,
      'daily_allowance', 'bank_transfer', 'completed',
      'Daily allowance payment for ' || payment_record.due_date,
      'TXN_' || UPPER(SUBSTRING(gen_random_uuid()::text, 1, 8)),
      'pi_' || LOWER(SUBSTRING(gen_random_uuid()::text, 1, 24))
    );
  END LOOP;
END $$;

-- ============================================================================
-- INSERT SAMPLE SLA METRICS
-- ============================================================================

DO $$
DECLARE
  contract_record RECORD;
BEGIN
  FOR contract_record IN SELECT id FROM logistics.contracts WHERE status = 'active' LOOP
    -- Insert SLA metrics for the past 3 months
    FOR month_offset IN 0..2 LOOP
      INSERT INTO reporting.sla_metrics (
        contract_id, metric_type, target_value, actual_value,
        compliance_percentage, period_start, period_end, status
      ) VALUES 
      (contract_record.id, 'on_time_delivery', 95.00, 92.5 + RANDOM() * 5,
       92.5 + RANDOM() * 7.5, 
       DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month' * month_offset),
       DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month' * month_offset) + INTERVAL '1 month' - INTERVAL '1 day',
       CASE WHEN (92.5 + RANDOM() * 7.5) >= 95 THEN 'compliant' ELSE 'warning' END),
      (contract_record.id, 'vehicle_availability', 90.00, 88.0 + RANDOM() * 10,
       88.0 + RANDOM() * 12,
       DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month' * month_offset),
       DATE_TRUNC('month', CURRENT_DATE - INTERVAL '1 month' * month_offset) + INTERVAL '1 month' - INTERVAL '1 day',
       CASE WHEN (88.0 + RANDOM() * 12) >= 90 THEN 'compliant' ELSE 'warning' END);
    END LOOP;
  END LOOP;
END $$;

-- ============================================================================
-- INSERT SAMPLE NOTIFICATIONS
-- ============================================================================

DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id FROM logistics.profiles WHERE role IN ('driver', 'supervisor', 'contractor') LOOP
    INSERT INTO logistics.notifications (
      user_id, title, message, type, category
    ) VALUES 
    (user_record.id, 'Welcome to SefTech Logistics', 'Your account has been set up successfully', 'success', 'system'),
    (user_record.id, 'System Maintenance', 'Scheduled maintenance tonight from 2-4 AM', 'info', 'system');
  END LOOP;
END $$;

-- ============================================================================
-- CREATE SAMPLE PERFORMANCE DASHBOARDS
-- ============================================================================

DO $$
DECLARE
  user_record RECORD;
BEGIN
  FOR user_record IN SELECT id, role FROM logistics.profiles LOOP
    INSERT INTO reporting.performance_dashboards (
      dashboard_type, user_id, config, is_default
    ) VALUES (
      user_record.role || '_dashboard',
      user_record.id,
      jsonb_build_object(
        'widgets', ARRAY['fleet_status', 'recent_trips', 'payments', 'notifications'],
        'layout', 'grid',
        'refresh_interval', 30
      ),
      true
    );
  END LOOP;
END $$;

-- ============================================================================
-- UPDATE SYSTEM HEALTH STATUS
-- ============================================================================

INSERT INTO monitoring.system_health (service_name, status, response_time, error_rate, cpu_usage, memory_usage, disk_usage, active_connections) VALUES
('unified_database', 'healthy', 25.3, 0.0, 45.2, 67.8, 23.1, 15),
('realtime_subscriptions', 'healthy', 12.7, 0.1, 32.4, 45.6, 12.3, 28),
('payment_processing', 'healthy', 89.4, 0.0, 23.1, 34.5, 45.7, 8),
('fleet_tracking', 'healthy', 34.2, 0.2, 56.7, 78.9, 34.2, 42);

-- ============================================================================
-- LOG COMPLETION
-- ============================================================================

INSERT INTO monitoring.audit_logs (action, resource_type, new_values) VALUES 
('data_population', 'unified_infrastructure', 
 jsonb_build_object(
   'profiles_created', (SELECT COUNT(*) FROM logistics.profiles),
   'trucks_created', (SELECT COUNT(*) FROM logistics.trucks),
   'trips_created', (SELECT COUNT(*) FROM logistics.trips),
   'locations_created', (SELECT COUNT(*) FROM logistics.truck_locations),
   'payments_created', (SELECT COUNT(*) FROM payments.payments),
   'timestamp', NOW()
 ));

-- Display summary of created data
DO $$
BEGIN
  RAISE NOTICE '=== UNIFIED INFRASTRUCTURE DATA POPULATION COMPLETE ===';
  RAISE NOTICE 'Profiles: %', (SELECT COUNT(*) FROM logistics.profiles);
  RAISE NOTICE 'Trucks: %', (SELECT COUNT(*) FROM logistics.trucks);
  RAISE NOTICE 'Contracts: %', (SELECT COUNT(*) FROM logistics.contracts);
  RAISE NOTICE 'Trips: %', (SELECT COUNT(*) FROM logistics.trips);
  RAISE NOTICE 'Truck Locations: %', (SELECT COUNT(*) FROM logistics.truck_locations);
  RAISE NOTICE 'Predictive Maintenance Records: %', (SELECT COUNT(*) FROM logistics.predictive_maintenance);
  RAISE NOTICE 'Payment Schedules: %', (SELECT COUNT(*) FROM payments.payment_schedules);
  RAISE NOTICE 'Payments: %', (SELECT COUNT(*) FROM payments.payments);
  RAISE NOTICE 'SLA Metrics: %', (SELECT COUNT(*) FROM reporting.sla_metrics);
  RAISE NOTICE 'Notifications: %', (SELECT COUNT(*) FROM logistics.notifications);
  RAISE NOTICE 'Performance Dashboards: %', (SELECT COUNT(*) FROM reporting.performance_dashboards);
  RAISE NOTICE '=== Ready for production use! ===';
END $$;
