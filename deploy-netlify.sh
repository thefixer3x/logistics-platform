#!/bin/bash

echo "🚀 Deploying Logistics Platform to fleet.seftec.tech..."

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📦 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Build the project
echo "🔨 Building project..."
npm run build

# Check if build succeeded
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed! Please fix errors and try again."
    exit 1
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
netlify deploy --prod

echo "✅ Deployment complete!"
echo ""
echo "🔗 Your site will be available at: https://fleet.seftec.tech"
echo "📊 Check deployment status in your Netlify dashboard"
echo ""
echo "Next steps:"
echo "1. Configure custom domain 'fleet.seftec.tech' in Netlify settings"
echo "2. Set up environment variables in Netlify dashboard"
echo "3. Add DNS CNAME record: fleet → [your-site].netlify.app"
echo "4. Update Supabase allowed URLs to include https://fleet.seftec.tech"
echo "5. Configure payment gateway webhooks with fleet.seftec.tech URLs"
echo ""
echo "📋 See FLEET_SEFTEC_DEPLOYMENT.md for detailed instructions"