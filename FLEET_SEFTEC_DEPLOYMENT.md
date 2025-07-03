# Deployment Guide: fleet.seftec.tech

## 🎯 Domain Configuration: fleet.seftec.tech

### Step 1: Deploy to Netlify

**Option A: Quick Deploy (Recommended)**
```bash
# Commit current changes first
git add .
git commit -m "feat: configure for fleet.seftec.tech deployment"
git push origin bug-hunt-2025

# Deploy using script
./deploy-netlify.sh
```

**Option B: Manual Deploy**
```bash
# Install and login to Netlify CLI
npm install -g netlify-cli
netlify login

# Initialize new site
netlify init --manual

# Deploy
netlify deploy --prod
```

### Step 2: Configure Custom Domain in Netlify

1. **In Netlify Dashboard:**
   - Go to your site settings
   - Click "Domain settings"
   - Click "Add custom domain"
   - Enter: `fleet.seftec.tech`
   - Netlify will provide SSL automatically

2. **Configure DNS for seftec.tech domain:**
   ```
   Type: CNAME
   Name: fleet
   Value: [your-netlify-site-name].netlify.app
   TTL: 300 (or default)
   ```

### Step 3: Environment Variables Setup

Add these in Netlify Dashboard → Site settings → Environment variables:

```bash
# Core Configuration
NEXT_PUBLIC_APP_URL=https://fleet.seftec.tech
NODE_ENV=production

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Payment Gateways
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id

PAYSTACK_SECRET_KEY=your_paystack_secret_key
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret_key

# Verification Service
PREMBLY_APP_ID=your_prembly_app_id
PREMBLY_X_API_KEY=your_prembly_api_key

# Optional: Mapbox (if using maps)
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Step 4: Post-Deployment Configuration

#### 4.1 Update Supabase Settings
In your Supabase dashboard:
1. Go to Authentication → Settings
2. Add to "Site URL": `https://fleet.seftec.tech`
3. Add to "Redirect URLs": 
   - `https://fleet.seftec.tech/auth/callback`
   - `https://fleet.seftec.tech/dashboard`

#### 4.2 Configure Payment Webhook URLs

**Stripe:**
- Dashboard → Webhooks → Add endpoint
- URL: `https://fleet.seftec.tech/api/webhooks/stripe`
- Events: `invoice.payment_succeeded`, `customer.subscription.updated`, etc.

**Paystack:**
- Dashboard → Settings → Webhooks
- URL: `https://fleet.seftec.tech/api/webhooks/paystack`

**Flutterwave:**
- Dashboard → Settings → Webhooks
- URL: `https://fleet.seftec.tech/api/webhooks/flutterwave`

#### 4.3 Update CORS Settings
If using external APIs, add `https://fleet.seftec.tech` to allowed origins.

### Step 5: Verification Checklist

After deployment, test these endpoints:

- [ ] **Homepage**: https://fleet.seftec.tech
- [ ] **Login**: https://fleet.seftec.tech/login
- [ ] **Dashboard**: https://fleet.seftec.tech/dashboard
- [ ] **API Health**: https://fleet.seftec.tech/api/setup
- [ ] **Payment Test**: https://fleet.seftec.tech/dashboard/payment-test

### Step 6: Monitoring & Maintenance

#### Performance Monitoring
```bash
# Test site performance
lighthouse https://fleet.seftec.tech --view

# Monitor in Netlify dashboard
# - Build logs
# - Function logs  
# - Analytics
```

#### Health Checks
Set up monitoring for:
- Database connectivity
- Payment gateway status
- SSL certificate renewal
- Site uptime

### Security Considerations

1. **SSL/HTTPS**: Automatically provided by Netlify
2. **Environment Variables**: Never commit secrets to git
3. **CSP Headers**: Already configured in netlify.toml
4. **Rate Limiting**: Consider implementing for API routes

### Troubleshooting

**Common Issues:**

1. **DNS Propagation**: May take up to 24 hours
   ```bash
   # Check DNS propagation
   nslookup fleet.seftec.tech
   ```

2. **Build Failures**: Check Netlify build logs
   ```bash
   netlify logs
   ```

3. **Environment Variables**: Redeploy after adding new vars
   ```bash
   netlify deploy --prod
   ```

4. **Database Connection**: Verify Supabase URLs in environment

### Rollback Strategy

If issues occur:
1. Netlify Dashboard → Deploys
2. Find last working deployment
3. Click "Publish deploy"

### Contact Information

- **Primary Domain**: fleet.seftec.tech
- **Backup Domain**: [your-site].netlify.app
- **Repository**: [your-repo-url]
- **Deployment**: Netlify
- **Database**: Supabase

---

## Quick Commands Reference

```bash
# Deploy
./deploy-netlify.sh

# Check build locally
npm run build

# Test production build
npm start

# View build logs
netlify logs

# Open site
netlify open:site
```