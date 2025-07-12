#!/bin/bash

# Live Demo Deployment Script
echo "🚀 Setting up Live Demo Deployment..."

# Create production environment for demo mode
echo "📝 Creating production environment configuration..."
cat > .env.production << EOF
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_SUPABASE_URL=https://demo.logistics.seftech.com
NEXT_PUBLIC_SUPABASE_ANON_KEY=demo-anon-key-for-display-only
SUPABASE_SERVICE_ROLE_KEY=demo-service-key-for-display-only
NEXT_PUBLIC_APP_URL=https://logistics-demo.netlify.app
EOF

echo "✅ Environment configuration created"

# Use demo-specific Next.js config
echo "📦 Using demo-specific build configuration..."
cp next.config.demo.js next.config.js

echo "🔨 Building project for production demo..."
npm run build

echo "🎯 Demo build completed!"
echo ""
echo "📋 Next Steps for Live Deployment:"
echo "1. Push to your Git repository:"
echo "   git add ."
echo "   git commit -m 'Setup live demo deployment'"
echo "   git push origin main"
echo ""
echo "2. Configure your deployment platform:"
echo "   - Netlify: Connect your repo and deploy automatically"
echo "   - Vercel: Connect your repo and deploy automatically"
echo "   - Other: Upload the .next folder"
echo ""
echo "3. Set environment variables in your deployment platform:"
echo "   NEXT_PUBLIC_DEMO_MODE=true"
echo ""
echo "🌟 Your live demo will be available at your deployment URL!"
echo "   Features included:"
echo "   ✅ Full logistics dashboard"
echo "   ✅ Fleet management interface"
echo "   ✅ Payment tracking system"
echo "   ✅ Analytics and reporting"
echo "   ✅ Real-time status indicators"
echo "   ✅ Mobile-responsive design"
