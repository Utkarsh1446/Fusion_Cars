#!/bin/bash

# Fusion Cars Backend - Railway Deployment Script
# Automates deployment to Railway.app

echo "🚂 Deploying Fusion Cars Backend to Railway"
echo "============================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Railway CLI is installed
if ! command -v railway &> /dev/null; then
    echo -e "${RED}❌ Railway CLI is not installed${NC}"
    echo ""
    echo "Install it with:"
    echo "  npm install -g @railway/cli"
    echo ""
    exit 1
fi

echo -e "${GREEN}✅ Railway CLI detected${NC}"
echo ""

# Check if logged in
if ! railway whoami &> /dev/null; then
    echo -e "${YELLOW}🔐 Not logged in to Railway${NC}"
    echo "Logging in..."
    railway login

    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Login failed${NC}"
        exit 1
    fi
fi

USER=$(railway whoami 2>/dev/null | grep "Logged in as" | cut -d ' ' -f4)
echo -e "${GREEN}✅ Logged in as: $USER${NC}"
echo ""

# Initialize project if not already
if [ ! -f ".railway" ]; then
    echo -e "${BLUE}🚀 Initializing Railway project...${NC}"
    railway init

    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to initialize project${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Project initialized${NC}"
    echo ""
fi

# Generate secrets for production
echo -e "${BLUE}🔐 Generating secure secrets...${NC}"
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
ADMIN_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

echo -e "${GREEN}✅ Secrets generated${NC}"
echo ""

# Display environment variables
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${YELLOW}📋 Environment Variables to Set${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "You'll need to set these in Railway dashboard:"
echo ""
echo "1. MONGODB_URI"
echo "   Value: <your-mongodb-atlas-connection-string>"
echo ""
echo "2. JWT_SECRET"
echo "   Value: $JWT_SECRET"
echo ""
echo "3. ADMIN_REGISTRATION_KEY"
echo "   Value: $ADMIN_KEY"
echo ""
echo "4. CORS_ORIGIN"
echo "   Value: https://your-vercel-app.vercel.app"
echo ""
echo "5. NODE_ENV"
echo "   Value: production"
echo ""
echo "6. PORT"
echo "   Value: 5000"
echo ""

# Ask if user wants to continue
echo -e "${YELLOW}⚠️  Important: Have you added these variables in Railway dashboard?${NC}"
read -p "Continue with deployment? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled."
    echo ""
    echo "To add variables:"
    echo "1. Go to: https://railway.app/dashboard"
    echo "2. Select your project"
    echo "3. Click 'Variables' tab"
    echo "4. Add the variables listed above"
    echo ""
    exit 0
fi

# Deploy to Railway
echo ""
echo -e "${BLUE}🚀 Deploying to Railway...${NC}"
echo ""

railway up

if [ $? -eq 0 ]; then
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo -e "${BLUE}📡 Getting deployment URL...${NC}"

    # Try to get the URL
    DEPLOY_URL=$(railway status 2>/dev/null | grep "https://" | awk '{print $1}')

    if [ -n "$DEPLOY_URL" ]; then
        echo ""
        echo -e "${GREEN}🌐 Your backend is live at:${NC}"
        echo "   $DEPLOY_URL"
        echo ""
        echo -e "${BLUE}🧪 Test your deployment:${NC}"
        echo "   curl $DEPLOY_URL/api/health"
        echo ""
        echo -e "${BLUE}📋 Next steps:${NC}"
        echo ""
        echo "1. Update frontend NEXT_PUBLIC_API_URL:"
        echo "   $DEPLOY_URL/api"
        echo ""
        echo "2. Update CORS_ORIGIN in Railway dashboard:"
        echo "   https://your-vercel-app.vercel.app"
        echo ""
        echo "3. Create admin user:"
        echo "   curl -X POST $DEPLOY_URL/api/auth/admin/register \\"
        echo "     -H \"Content-Type: application/json\" \\"
        echo "     -d '{"
        echo "       \"name\": \"Admin\","
        echo "       \"email\": \"admin@fusioncars.com\","
        echo "       \"password\": \"admin123\","
        echo "       \"phone\": \"+919876543210\","
        echo "       \"role\": \"super-admin\","
        echo "       \"permissions\": [\"manage_cars\",\"manage_users\",\"manage_bookings\",\"manage_reviews\",\"view_analytics\"],"
        echo "       \"adminKey\": \"$ADMIN_KEY\""
        echo "     }'"
    else
        echo ""
        echo "Check your deployment at: https://railway.app/dashboard"
    fi
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${YELLOW}💾 Save your ADMIN_REGISTRATION_KEY:${NC}"
    echo "   $ADMIN_KEY"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
else
    echo ""
    echo -e "${RED}❌ Deployment failed${NC}"
    echo ""
    echo "Check Railway logs for errors:"
    echo "  railway logs"
    echo ""
    exit 1
fi
