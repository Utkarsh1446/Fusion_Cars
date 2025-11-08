#!/bin/bash

# Fusion Cars Backend - Local Setup Script
# Automatically sets up the backend for development

echo "🚗 Fusion Cars Backend Setup"
echo "=============================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    echo "Please install Node.js from https://nodejs.org"
    exit 1
fi

echo -e "${GREEN}✅ Node.js $(node --version) detected${NC}"
echo ""

# Check if MongoDB is installed
if ! command -v mongosh &> /dev/null && ! command -v mongo &> /dev/null; then
    echo -e "${YELLOW}⚠️  MongoDB CLI not found${NC}"
    echo "You can use MongoDB Atlas (cloud) instead"
    echo ""
fi

# Install dependencies
echo -e "${BLUE}📦 Installing dependencies...${NC}"
npm install

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo -e "${BLUE}📝 Creating .env file...${NC}"

    # Generate random secrets
    JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
    ADMIN_KEY=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")

    cat > .env << EOF
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/fusion_cars

# JWT Configuration
JWT_SECRET=$JWT_SECRET

# Admin Registration Key
ADMIN_REGISTRATION_KEY=$ADMIN_KEY

# CORS Origin
CORS_ORIGIN=http://localhost:3000,http://localhost:3001

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_password

# Admin Email
ADMIN_EMAIL=admin@fusioncars.com

# Frontend URL
FRONTEND_URL=http://localhost:3000
EOF

    echo -e "${GREEN}✅ .env file created${NC}"
    echo -e "${YELLOW}📌 Your ADMIN_REGISTRATION_KEY: $ADMIN_KEY${NC}"
    echo -e "${YELLOW}   Save this! You'll need it to create admin users.${NC}"
    echo ""
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping...${NC}"
    echo ""
fi

# Check MongoDB connection
echo -e "${BLUE}🗄️  Checking MongoDB...${NC}"

MONGO_URI=$(grep MONGODB_URI .env | cut -d '=' -f2)

if [[ $MONGO_URI == *"localhost"* ]]; then
    echo "Local MongoDB detected"

    # Try to connect to local MongoDB
    if command -v mongosh &> /dev/null; then
        if mongosh "$MONGO_URI" --eval "db.version()" &> /dev/null; then
            echo -e "${GREEN}✅ Local MongoDB is running${NC}"
        else
            echo -e "${YELLOW}⚠️  Local MongoDB not running${NC}"
            echo "Start MongoDB with: brew services start mongodb-community"
            echo "Or update MONGODB_URI in .env to use MongoDB Atlas"
        fi
    fi
else
    echo "MongoDB Atlas (cloud) detected"
    echo "Make sure to whitelist your IP in Atlas dashboard"
fi

echo ""

# Display next steps
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${BLUE}📋 Next steps:${NC}"
echo ""
echo "1. Start the server:"
echo "   npm run dev"
echo ""
echo "2. Create your first admin user:"
echo "   curl -X POST http://localhost:5000/api/auth/admin/register \\"
echo "     -H \"Content-Type: application/json\" \\"
echo "     -d '{"
echo "       \"name\": \"Admin\","
echo "       \"email\": \"admin@fusioncars.com\","
echo "       \"password\": \"admin123\","
echo "       \"phone\": \"+919876543210\","
echo "       \"role\": \"super-admin\","
echo "       \"permissions\": [\"manage_cars\",\"manage_users\",\"manage_bookings\",\"manage_reviews\",\"view_analytics\"],"
echo "       \"adminKey\": \"<YOUR_ADMIN_KEY_FROM_ENV>\""
echo "     }'"
echo ""
echo "3. Test the server:"
echo "   curl http://localhost:5000/api/health"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo -e "${BLUE}📚 Documentation:${NC}"
echo "- Backend README: README.md"
echo "- API Docs: ../IMPLEMENTATION_GUIDE.md"
echo "- Deployment: ../DEPLOYMENT_CHECKLIST.md"
echo ""
echo "🚀 Ready to start developing!"
