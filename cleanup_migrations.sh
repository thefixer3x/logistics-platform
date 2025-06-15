#!/bin/bash

# Supabase Migration Cleanup Script
echo "🧹 Supabase Migration Cleanup"
echo "============================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this from your project root directory"
    exit 1
fi

echo "📍 Current project: $(pwd)"
echo ""

# Check Supabase CLI
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install with:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found: $(which supabase)"
echo ""

# Check if project is linked
echo "🔗 Checking project link status..."
if supabase projects list | grep -q "mxtsdgkwzjzlttpotole"; then
    echo "✅ Project linked to Supabase"
else
    echo "⚠️  Project not linked. To link:"
    echo "   supabase link --project-ref mxtsdgkwzjzlttpotole"
    echo ""
    echo "🎯 QUICK FIX: Use your test-setup page instead:"
    echo "   http://localhost:3000/test-setup"
    exit 0
fi

# Check migration status
echo ""
echo "📋 Checking migration status..."
if supabase db diff --linked > /dev/null 2>&1; then
    echo "✅ Database accessible"
    
    # Show current migrations
    echo ""
    echo "📁 Local migration files:"
    ls -la supabase/migrations/ 2>/dev/null || echo "   No migration files found"
    
    echo ""
    echo "🔄 Database diff status:"
    supabase db diff --linked
    
else
    echo "⚠️  Cannot access database or check migrations"
    echo ""
    echo "🎯 OPTIONS:"
    echo "1. Use test-setup page: http://localhost:3000/test-setup"
    echo "2. Check your .env.local file has correct Supabase credentials"
    echo "3. Verify your Supabase project is accessible"
fi

echo ""
echo "🚀 QUICK ACTIONS:"
echo "=================="
echo "For Development:"
echo "  → Visit: http://localhost:3000/test-setup"
echo "  → Click: 'Setup Database'"
echo ""
echo "For Production Setup:"
echo "  → supabase link --project-ref mxtsdgkwzjzlttpotole"
echo "  → supabase db pull --linked"
echo "  → supabase db push --linked"
echo ""
echo "📖 See MIGRATION_CLEANUP.md for detailed instructions"
