-- Create health check table
CREATE TABLE IF NOT EXISTS public.health_check (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    status TEXT DEFAULT 'ok',
    last_checked TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    details JSONB
);

-- Insert initial health check record
INSERT INTO public.health_check (status, details)
VALUES ('ok', '{"version": "1.0.0", "service": "logistics-platform"}');

-- Enable RLS
ALTER TABLE public.health_check ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous read access
CREATE POLICY "Allow anonymous read access" ON public.health_check
    FOR SELECT
    TO anon
    USING (true);

-- Create function to update health check
CREATE OR REPLACE FUNCTION public.update_health_check()
RETURNS void AS $$
BEGIN
    UPDATE public.health_check
    SET last_checked = NOW(),
        status = 'ok',
        details = jsonb_build_object(
            'version', '1.0.0',
            'service', 'logistics-platform',
            'last_updated', NOW()
        );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 