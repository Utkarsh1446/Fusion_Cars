#!/bin/bash

# Fusion Cars - Production Environment Setup Script
# This script helps you set up environment variables for production

echo "🚀 Fusion Cars - Production Environment Setup"
echo "============================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to generate random string
generate_secret() {
    openssl rand -hex 32 2>/dev/null || node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
}

echo -e "${BLUE}This script will help you generate environment variables for production.${NC}"
echo ""

# Generate secrets
echo -e "${GREEN}Generating secure secrets...${NC}"
JWT_SECRET=$(generate_secret)
ADMIN_KEY=$(generate_secret)

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}BACKEND ENVIRONMENT VARIABLES (Railway/Render)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Copy these to your Railway/Render dashboard:"
echo ""
echo "MONGODB_URI=<your-mongodb-atlas-connection-string>"
echo "JWT_SECRET=$JWT_SECRET"
echo "ADMIN_REGISTRATION_KEY=$ADMIN_KEY"
echo "CORS_ORIGIN=https://your-vercel-app.vercel.app"
echo "NODE_ENV=production"
echo "PORT=5000"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}FRONTEND ENVIRONMENT VARIABLES (Vercel)${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Copy this to your Vercel dashboard:"
echo ""
echo "NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}IMPORTANT: Save these values!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Your ADMIN_REGISTRATION_KEY: $ADMIN_KEY"
echo ""
echo "You'll need this to create your first admin user:"
echo ""
echo "curl -X POST https://your-backend.railway.app/api/auth/admin/register \\"
echo "  -H \"Content-Type: application/json\" \\"
echo "  -d '{"
echo "    \"name\": \"Admin\","
echo "    \"email\": \"admin@fusioncars.com\","
echo "    \"password\": \"admin123\","
echo "    \"phone\": \"+919876543210\","
echo "    \"role\": \"super-admin\","
echo "    \"permissions\": [\"manage_cars\",\"manage_users\",\"manage_bookings\",\"manage_reviews\",\"view_analytics\"],"
echo "    \"adminKey\": \"$ADMIN_KEY\""
echo "  }'"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}Next Steps:${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "1. Deploy backend to Railway"
echo "2. Add the backend environment variables above"
echo "3. Deploy frontend to Vercel"
echo "4. Add the frontend environment variable above"
echo "5. Create admin user with the curl command above"
echo "6. Login at https://your-vercel-app.vercel.app/admin"
echo ""
echo -e "${GREEN}Documentation:${NC}"
echo "- Quick Start: QUICK_DEPLOY.md"
echo "- Full Guide: IMPLEMENTATION_GUIDE.md"
echo ""
echo "✅ Environment setup complete!"
