# Netlify Deployment Guide for Logistics Platform

## Prerequisites
- Netlify account
- GitHub/GitLab/Bitbucket repository
- Domain or subdomain ready

## Step 1: Prepare for Deployment

### 1.1 Install Netlify Plugin
```bash
npm install --save-dev @netlify/plugin-nextjs
```

### 1.2 Update package.json (if needed)
Add to scripts:
```json
{
  "scripts": {
    "netlify-build": "next build && cp -r .next/static .next/standalone/.next/static && cp -r public .next/standalone/public"
  }
}
```

## Step 2: Deploy to Netlify

### Option A: Deploy via Netlify CLI
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login to Netlify
netlify login

# Initialize new site
netlify init

# Deploy
netlify deploy --prod
```

### Option B: Deploy via Git Integration

1. Push code to repository:
```bash
git add .
git commit -m "feat: prepare for Netlify deployment"
git push origin bug-hunt-2025
```

2. In Netlify Dashboard:
   - Click "New site from Git"
   - Choose your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

## Step 3: Configure Subdomain

### For subdomain like `logistics.yourdomain.com`:

1. In Netlify site settings:
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Enter: `logistics.yourdomain.com`

2. Configure DNS:
   - Add CNAME record:
     ```
     Type: CNAME
     Name: logistics
     Value: [your-netlify-site].netlify.app
     ```

### For Netlify subdomain:
- Your site will be available at: `[site-name].netlify.app`
- You can change this in site settings

## Step 4: Environment Variables

In Netlify Dashboard > Site settings > Environment variables:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Payment Gateways
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
PAYSTACK_SECRET_KEY=your_paystack_secret
FLUTTERWAVE_SECRET_KEY=your_flutterwave_secret

# App URL (update after deployment)
NEXT_PUBLIC_APP_URL=https://logistics.yourdomain.com
```

## Step 5: Post-Deployment Configuration

### 5.1 Update Supabase URLs
In Supabase Dashboard:
- Add your Netlify URL to allowed URLs
- Update redirect URLs for authentication

### 5.2 Update Payment Gateway Webhooks
- Stripe: Add webhook endpoint `https://logistics.yourdomain.com/api/webhooks/stripe`
- Paystack: Add webhook URL in dashboard
- Flutterwave: Configure webhook URL

### 5.3 Update CORS Settings
If using external APIs, add your Netlify domain to CORS allowed origins

## Common Issues & Solutions

### Issue: "Module not found" errors
Solution: Clear cache and redeploy
```bash
netlify deploy --prod --clear
```

### Issue: API routes not working
Solution: Ensure @netlify/plugin-nextjs is installed and configured

### Issue: Environment variables not loading
Solution: Redeploy after adding environment variables

### Issue: Build timeout
Solution: Optimize build or increase timeout in netlify.toml:
```toml
[build]
  command = "npm run build"
  publish = ".next"
  commandTimeout = 1200
```

## Monitoring

1. **Build Logs**: Check Netlify dashboard for build errors
2. **Function Logs**: Monitor API route performance
3. **Analytics**: Enable Netlify Analytics for traffic insights

## Continuous Deployment

After initial setup, every push to your branch will trigger automatic deployment:

```bash
git add .
git commit -m "feat: your changes"
git push origin bug-hunt-2025
```

## Rollback

If issues arise:
1. Go to Netlify Dashboard > Deploys
2. Find previous working deployment
3. Click "Publish deploy" on that version

## Performance Tips

1. Enable Netlify's automatic image optimization
2. Use Netlify's edge functions for geo-distributed logic
3. Enable prerendering for better performance:
   ```toml
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   
   [plugins.inputs.experimental]
     enableImageOptimization = true
   ```

## Support

- Netlify Docs: https://docs.netlify.com
- Next.js on Netlify: https://docs.netlify.com/integrations/frameworks/next-js/
- Community Forum: https://answers.netlify.com