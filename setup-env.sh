#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🚀 Setting up your development environment...${NC}"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${GREEN}ℹ️  Creating .env.local from template...${NC}"
    cp env.template .env.local
else
    echo -e "${YELLOW}ℹ️  .env.local already exists. Backing up as .env.local.bak${NC}"
    cp .env.local .env.local.bak
    cp env.template .env.local
fi

# Generate a secure secret for NEXTAUTH_SECRET
if ! command -v openssl &> /dev/null; then
    echo -e "${YELLOW}⚠️  openssl not found. Please install it to generate secure secrets.${NC}"
else
    echo -e "${GREEN}🔑 Generating secure NEXTAUTH_SECRET...${NC}"
    SECRET=$(openssl rand -base64 32)
    # For macOS
    if [[ "$(uname)" == "Darwin" ]]; then
        sed -i '' "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$SECRET|" .env.local
    # For Linux
    else
        sed -i "s|NEXTAUTH_SECRET=.*|NEXTAUTH_SECRET=$SECRET|" .env.local
    fi
fi

echo -e "\n${GREEN}✅ Environment setup complete!${NC}"
echo -e "\n${YELLOW}ℹ️  Please edit .env.local and update the following values:${NC}"
echo "1. NEXT_PUBLIC_SUPABASE_URL"
echo "2. NEXT_PUBLIC_SUPABASE_ANON_KEY"
echo "3. SUPABASE_SERVICE_ROLE_KEY"
echo "4. Any other values specific to your setup"
echo -e "\n${YELLOW}You can edit the file with:${NC}"
echo "nano .env.local  # or your preferred editor"
