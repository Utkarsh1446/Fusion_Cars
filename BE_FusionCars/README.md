# Fusion Cars - Backend API

Premium car reselling platform backend built with Node.js, Express, and MongoDB.

## 🚀 Quick Start

### Prerequisites

- Node.js >= 16.x
- MongoDB (local or MongoDB Atlas)
- npm >= 8.x

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env and configure:
# - MONGODB_URI
# - JWT_SECRET
# - ADMIN_REGISTRATION_KEY
# - CORS_ORIGIN
```

### Start Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start

# Start WhatsApp bot (optional)
npm run whatsapp
```

Server will run on **http://localhost:5000**

## 📦 Environment Variables

### Required Variables

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/fusion_cars
# Or MongoDB Atlas:
# MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fusion_cars

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Admin Registration Key (for creating first admin)
ADMIN_REGISTRATION_KEY=your_secret_admin_key

# CORS Origins (comma-separated)
CORS_ORIGIN=http://localhost:3000,https://your-vercel-app.vercel.app

# Server Port
PORT=5000

# Environment
NODE_ENV=development
```

### Optional Variables

```env
# Email (for notifications)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WhatsApp Bot
ENABLE_WHATSAPP_BOT=false
```

## 🗄️ Database Setup

### Option 1: Local MongoDB

```bash
# Install MongoDB
brew install mongodb-community  # macOS
# or
sudo apt install mongodb         # Ubuntu

# Start MongoDB
brew services start mongodb-community  # macOS
# or
sudo systemctl start mongodb           # Ubuntu

# Verify connection
mongosh
```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster (free tier available)
3. Get connection string
4. Update `MONGODB_URI` in `.env`

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fusion_cars?retryWrites=true&w=majority
```

## 👤 Create First Admin User

### Method 1: API Request

```bash
curl -X POST http://localhost:5000/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@fusioncars.com",
    "phone": "+919876543210",
    "password": "admin123",
    "role": "super-admin",
    "permissions": ["manage_cars", "manage_users", "manage_bookings", "manage_reviews", "view_analytics", "manage_admins"],
    "adminKey": "YOUR_ADMIN_KEY_FROM_ENV"
  }'
```

### Method 2: MongoDB Shell

```javascript
// Connect to database
use fusion_cars

// Insert admin (after hashing password with bcrypt)
db.admins.insertOne({
  name: "Admin User",
  email: "admin@fusioncars.com",
  phone: "+919876543210",
  password: "$2a$10$...", // Use bcrypt to hash "admin123"
  role: "super-admin",
  permissions: ["manage_cars", "manage_users", "manage_bookings", "manage_reviews", "view_analytics"],
  active: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 📡 API Endpoints

### Public Endpoints

```
GET    /api/health                    # Health check
GET    /api/cars                      # Get all cars (with filters)
GET    /api/cars/featured             # Get featured cars
GET    /api/cars/:id                  # Get single car
POST   /api/auth/login                # User login
POST   /api/auth/register             # User registration
POST   /api/contact                   # Contact form submission
```

### User Protected Endpoints

```
GET    /api/wishlist                  # Get user wishlist
POST   /api/wishlist/add              # Add to wishlist
DELETE /api/wishlist/remove/:carId    # Remove from wishlist
POST   /api/reviews                   # Create review
GET    /api/reviews/my-reviews        # Get user's reviews
```

### Admin Protected Endpoints

```
POST   /api/auth/admin/login          # Admin login
POST   /api/admin/cars                # Create car listing
PUT    /api/admin/cars/:id            # Update car
DELETE /api/admin/cars/:id            # Delete car
PATCH  /api/admin/cars/:id/sold       # Mark car as sold
PATCH  /api/admin/cars/:id/featured   # Toggle featured
GET    /api/admin/dashboard/stats     # Dashboard analytics
GET    /api/admin/users               # Get all users
GET    /api/admin/bookings            # Get bookings
GET    /api/admin/reviews             # Get reviews for moderation
PATCH  /api/admin/reviews/:id/status  # Approve/reject review
```

## 🗂️ Project Structure

```
BE_FusionCars/
├── config/
│   └── database.js          # MongoDB configuration
├── src/
│   ├── index.js             # Main server file
│   ├── models/              # Database models
│   │   ├── Car.js           # Enhanced car schema
│   │   ├── Admin.js         # Admin users
│   │   ├── User.js          # Customer users
│   │   ├── Review.js        # Reviews
│   │   ├── Wishlist.js      # Wishlist
│   │   └── Booking.js       # Bookings
│   ├── routes/              # API routes
│   │   ├── auth.js          # Authentication
│   │   ├── admin.js         # Admin operations
│   │   ├── cars.js          # Car CRUD
│   │   ├── reviews.js       # Reviews
│   │   ├── wishlist.js      # Wishlist
│   │   ├── users.js         # Users
│   │   ├── bookings.js      # Bookings
│   │   └── contact.js       # Contact forms
│   ├── middleware/
│   │   └── auth.js          # JWT authentication
│   ├── services/
│   │   └── whatsappBot.js   # WhatsApp bot
│   └── scripts/
│       └── startWhatsAppBot.js
├── package.json
└── .env.example
```

## 🚢 Deploy to Production

### Railway (Recommended)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up

# Add MongoDB plugin
railway add

# Set environment variables in Railway dashboard
```

**Environment Variables for Railway:**
```
MONGODB_URI=<from Railway MongoDB plugin>
JWT_SECRET=<generate random string>
ADMIN_REGISTRATION_KEY=<your secret>
CORS_ORIGIN=https://your-vercel-app.vercel.app
NODE_ENV=production
PORT=5000
```

### Render.com

1. Create account at render.com
2. New → Web Service
3. Connect GitHub repo
4. Root Directory: `BE_FusionCars`
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables
8. Deploy

### Heroku

```bash
# Install Heroku CLI
npm i -g heroku

# Login
heroku login

# Create app
heroku create fusion-cars-api

# Add MongoDB
heroku addons:create mongolab

# Set environment variables
heroku config:set JWT_SECRET=your_secret
heroku config:set ADMIN_REGISTRATION_KEY=your_key

# Deploy
git push heroku main
```

## 🤖 WhatsApp Bot

The WhatsApp bot allows admins to manage listings via WhatsApp!

### Setup

```bash
# Start bot (separate terminal)
npm run whatsapp

# Scan QR code with WhatsApp
# Add admin's WhatsApp number to database
```

### Commands

```
/help          - Show all commands
/create        - Create car listing (guided flow)
/list [page]   - View active listings
/update [id]   - Update car
/delete [id]   - Delete car
/sold [id]     - Mark as sold
/featured [id] - Toggle featured
/stats         - View statistics
/bookings      - View pending bookings
```

## 🔧 Development

### Available Scripts

```bash
npm run dev        # Start with nodemon (auto-reload)
npm start          # Start production server
npm run whatsapp   # Start WhatsApp bot
npm test           # Run tests
npm run lint       # Run ESLint
```

### Adding New Route

1. Create route file in `src/routes/`
2. Add to `src/index.js`:

```javascript
app.use('/api/new-route', require('./routes/new-route'));
```

### Adding New Model

1. Create model in `src/models/`
2. Define schema with mongoose
3. Export model

## 🐛 Troubleshooting

### MongoDB Connection Failed

```bash
# Check MongoDB is running
mongosh

# Check connection string
echo $MONGODB_URI

# For Atlas, whitelist your IP
# Go to Atlas → Network Access → Add IP
```

### Port Already in Use

```bash
# Kill process on port 5000
lsof -i :5000
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### CORS Errors

Add your frontend domain to CORS_ORIGIN:

```env
CORS_ORIGIN=http://localhost:3000,https://your-frontend.vercel.app
```

## 📊 API Response Format

### Success Response

```json
{
  "data": { ... },
  "message": "Success message",
  "pagination": {
    "total": 100,
    "page": 1,
    "pages": 10,
    "limit": 10
  }
}
```

### Error Response

```json
{
  "error": "Error message"
}
```

## 🔐 Security

- ✅ JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Input validation
- ✅ CORS protection
- ✅ Environment variables
- ✅ MongoDB injection prevention

## 📈 Performance

- Connection pooling for MongoDB
- Gzip compression enabled
- Indexed database queries
- Efficient aggregation pipelines

## 🧪 Testing

```bash
# Run tests
npm test

# Test specific endpoint
curl http://localhost:5000/api/health
```

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ for Fusion Cars**

For frontend deployment, see [../VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md)
