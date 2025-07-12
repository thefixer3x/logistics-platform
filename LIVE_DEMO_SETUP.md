# Live Demo Deployment Guide

## Option 1: Frontend-Only Demo (Recommended)

### Quick Setup Steps:

1. **Environment Configuration for Production Demo**

   ```bash
   # Create production environment file
   echo "NEXT_PUBLIC_DEMO_MODE=true" > .env.production
   echo "NEXT_PUBLIC_SUPABASE_URL=https://demo.logistics.app" >> .env.production
   echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-key" >> .env.production
   ```

2. **Deploy to Netlify/Vercel**

   ```bash
   # Build for production
   npm run build

   # Deploy (automatic via Git push)
   git add .
   git commit -m "Setup live demo with mock data"
   git push origin main
   ```

3. **Configure Environment Variables in Deployment Platform**
   - Set `NEXT_PUBLIC_DEMO_MODE=true`
   - Set demo URLs for Supabase (non-functional, just for display)

### Features Available in Demo Mode:

- ✅ Complete UI/UX showcase
- ✅ Mock fleet data with 24 trucks
- ✅ Simulated trip tracking
- ✅ Payment dashboard with sample transactions
- ✅ Analytics with realistic metrics
- ✅ Maintenance alerts system
- ✅ Route optimization display
- ✅ Real-time notifications simulation

## Option 2: Full-Stack Demo with Database

### Requirements:

- Supabase project setup
- Environment variables configuration
- Database migrations
- Authentication system

### Setup Steps:

1. Create Supabase project
2. Run migrations
3. Configure environment variables
4. Deploy with database connectivity

## Recommendation:

Start with Option 1 for immediate live demo capability.
Upgrade to Option 2 later for full functionality testing.
