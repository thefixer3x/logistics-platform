#!/bin/bash

# 🧪 COMPREHENSIVE WORKFLOW TESTING SUITE
# =======================================

echo "🚀 SefTech Logistics Platform - Comprehensive Testing"
echo "=================================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0
WARNINGS=0

# Test result function
test_result() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ PASS${NC}: $2"
        ((PASSED++))
    else
        echo -e "${RED}❌ FAIL${NC}: $2"
        ((FAILED++))
        if [ ! -z "$3" ]; then
            echo -e "   ${RED}Error:${NC} $3"
        fi
    fi
}

test_warning() {
    echo -e "${YELLOW}⚠️  WARN${NC}: $1"
    ((WARNINGS++))
}

test_info() {
    echo -e "${BLUE}ℹ️  INFO${NC}: $1"
}

echo "🔍 PHASE 1: SECURITY & SECRETS CHECK"
echo "===================================="

# Check for exposed secrets
test_info "Scanning for exposed secrets..."

# Check .env.local is in .gitignore
if grep -q "\.env\.local" .gitignore; then
    test_result 0 ".env.local is properly ignored"
else
    test_result 1 ".env.local not in .gitignore"
fi

# Check for hardcoded secrets in committed files
SECRET_PATTERNS=("sk_live_" "pk_live_" "rk_live_" "AKIA" "ghp_" "gho_" "ghu_" "ghs_" "ghr_")
FOUND_SECRETS=0

for pattern in "${SECRET_PATTERNS[@]}"; do
    if git ls-files | xargs grep -l "$pattern" 2>/dev/null | grep -v ".gitignore" | grep -v "test-" | head -1; then
        ((FOUND_SECRETS++))
    fi
done

if [ $FOUND_SECRETS -eq 0 ]; then
    test_result 0 "No exposed secrets found in git-tracked files"
else
    test_result 1 "Found $FOUND_SECRETS potential secrets in tracked files"
fi

echo ""
echo "📋 PHASE 2: CODE QUALITY & TYPE SAFETY"
echo "======================================"

# TypeScript type checking
test_info "Running TypeScript type check..."
npm run type-check > /tmp/typecheck.log 2>&1
test_result $? "TypeScript type checking" "$(cat /tmp/typecheck.log | head -3)"

# ESLint
test_info "Running ESLint..."
npm run lint > /tmp/eslint.log 2>&1
test_result $? "ESLint code quality check" "$(cat /tmp/eslint.log | head -3)"

echo ""
echo "🏗️  PHASE 3: BUILD TESTING"
echo "========================="

# Clean previous builds
rm -rf .next > /dev/null 2>&1

# Demo mode build
test_info "Testing demo mode build..."
NEXT_PUBLIC_DEMO_MODE=true npm run build > /tmp/demo-build.log 2>&1
DEMO_BUILD_STATUS=$?
test_result $DEMO_BUILD_STATUS "Demo mode build" "$(tail -3 /tmp/demo-build.log)"

# Check if demo build created expected files
if [ $DEMO_BUILD_STATUS -eq 0 ]; then
    if [ -d ".next" ]; then
        test_result 0 "Demo build output directory created"
    else
        test_result 1 "Demo build output directory missing"
    fi
fi

# Clean and test production build
rm -rf .next > /dev/null 2>&1
test_info "Testing production mode build..."
npm run build > /tmp/prod-build.log 2>&1
PROD_BUILD_STATUS=$?
test_result $PROD_BUILD_STATUS "Production mode build" "$(tail -3 /tmp/prod-build.log)"

echo ""
echo "📁 PHASE 4: FILE STRUCTURE VALIDATION"
echo "===================================="

# Required demo files
DEMO_FILES=(
    "lib/demo-config.ts"
    "app/demo/page.tsx" 
    "app/demo-landing/page.tsx"
    "netlify.toml"
    "vercel.json"
    "deploy-demo.sh"
)

for file in "${DEMO_FILES[@]}"; do
    if [ -f "$file" ]; then
        test_result 0 "$file exists"
    else
        test_result 1 "$file missing"
    fi
done

# Check demo configuration imports
test_info "Checking demo configuration imports..."
if grep -q "from.*demo-config" app/demo/page.tsx; then
    test_result 0 "Demo page imports configuration"
else
    test_result 1 "Demo page missing configuration import"
fi

if grep -q "from.*demo-config" app/demo-landing/page.tsx; then
    test_result 0 "Landing page imports configuration"
else
    test_result 1 "Landing page missing configuration import"
fi

echo ""
echo "🌐 PHASE 5: DEPLOYMENT CONFIGURATION"
echo "==================================="

# Check netlify.toml
if [ -f "netlify.toml" ]; then
    if grep -q "NEXT_PUBLIC_DEMO_MODE" netlify.toml; then
        test_result 0 "Netlify configuration supports demo mode"
    else
        test_result 1 "Netlify configuration missing demo mode"
    fi
else
    test_result 1 "netlify.toml missing"
fi

# Check vercel.json
if [ -f "vercel.json" ]; then
    if grep -q "NEXT_PUBLIC_DEMO_MODE" vercel.json; then
        test_result 0 "Vercel configuration supports demo mode"
    else
        test_warning "Vercel configuration may need demo mode support"
    fi
else
    test_warning "vercel.json missing (optional)"
fi

# Check package.json scripts
if grep -q '"build"' package.json && grep -q '"start"' package.json; then
    test_result 0 "Required npm scripts present"
else
    test_result 1 "Missing required npm scripts"
fi

echo ""
echo "🔧 PHASE 6: ENVIRONMENT CONFIGURATION"
echo "===================================="

# Check Next.js config
if [ -f "next.config.js" ]; then
    if grep -q "NEXT_PUBLIC_DEMO_MODE" next.config.js; then
        test_result 0 "Next.js configuration supports demo mode"
    else
        test_result 1 "Next.js configuration missing demo mode"
    fi
else
    test_result 1 "next.config.js missing"
fi

# Check environment template
if [ -f ".env.example" ] || [ -f ".env.template" ]; then
    test_result 0 "Environment template exists"
else
    test_warning "Environment template missing"
fi

echo ""
echo "🚦 PHASE 7: DEMO FUNCTIONALITY"
echo "============================="

# Check demo mode detection logic
test_info "Validating demo mode detection..."
if grep -q "isDemoMode" lib/demo-config.ts; then
    test_result 0 "Demo mode detection function exists"
else
    test_result 1 "Demo mode detection function missing"
fi

# Check demo data configuration
if grep -q "demoConfig" lib/demo-config.ts; then
    test_result 0 "Demo data configuration exists"
else
    test_result 1 "Demo data configuration missing"
fi

# Check page routing
if grep -q "demo-landing" app/page.tsx; then
    test_result 0 "Main page has demo routing"
else
    test_result 1 "Main page missing demo routing"
fi

echo ""
echo "📊 PHASE 8: GIT REPOSITORY STATUS"
echo "==============================="

# Check git status
UNTRACKED=$(git status --porcelain 2>/dev/null | grep "^??" | wc -l)
MODIFIED=$(git status --porcelain 2>/dev/null | grep "^.M" | wc -l)
STAGED=$(git status --porcelain 2>/dev/null | grep "^M" | wc -l)

test_info "Repository status:"
echo "   📁 Untracked files: $UNTRACKED"
echo "   📝 Modified files: $MODIFIED"  
echo "   📋 Staged files: $STAGED"

if [ $UNTRACKED -gt 0 ]; then
    test_warning "$UNTRACKED untracked files (review before commit)"
fi

# Check branch status
CURRENT_BRANCH=$(git branch --show-current 2>/dev/null)
test_info "Current branch: $CURRENT_BRANCH"

echo ""
echo "📋 TEST SUMMARY"
echo "==============="
echo ""
echo -e "${GREEN}✅ PASSED: $PASSED${NC}"
echo -e "${RED}❌ FAILED: $FAILED${NC}"
echo -e "${YELLOW}⚠️  WARNINGS: $WARNINGS${NC}"
echo ""

# Overall result
if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED! Ready for deployment.${NC}"
    echo ""
    echo "🚀 DEPLOYMENT READY:"
    echo "==================="
    echo "✅ Code quality verified"
    echo "✅ Build process validated"
    echo "✅ Demo mode configured"
    echo "✅ Deployment configs ready"
    echo "✅ No secrets exposed"
    echo ""
    echo "📋 NEXT STEPS:"
    echo "1. Stage changes: git add ."
    echo "2. Commit: git commit -m 'Deploy SefTech Logistics live demo'"
    echo "3. Push: git push origin main"
    echo "4. Configure hosting platform with NEXT_PUBLIC_DEMO_MODE=true"
    echo ""
    exit 0
else
    echo -e "${RED}❌ $FAILED TESTS FAILED! Please fix issues before deployment.${NC}"
    echo ""
    echo "🔧 REQUIRED FIXES:"
    echo "=================="
    echo "Please review and fix the failed tests above before proceeding."
    echo ""
    exit 1
fi
