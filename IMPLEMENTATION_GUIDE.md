# Fusion Cars - Premium Car Reselling Platform
## Complete Implementation Guide

## 🎯 Overview

Fusion Cars is an enterprise-grade luxury car reselling platform that **surpasses BigBoyToyz** with advanced features including:

### ✨ Premium Features That Beat BigBoyToyz:

1. **WhatsApp Bot Admin Panel** - Unique! Manage listings via WhatsApp
2. **Advanced Car Comparison** - Side-by-side comparison of up to 3 cars
3. **Real-time Financing Calculator** - Instant EMI calculations with visual breakdown
4. **360° Virtual Showroom** - Interactive car viewing (framework ready)
5. **Comprehensive Admin Dashboard** - Full CRUD with real-time analytics
6. **Multi-Image Galleries** - Support for 20+ images per car
7. **Detailed Inspection Reports** - Complete vehicle history tracking
8. **Review System** - Customer reviews with moderation
9. **Wishlist Management** - Save favorite cars
10. **Advanced Search & Filters** - Smart filtering system

---

## 📦 Tech Stack

### Backend
- **Node.js** + **Express.js**
- **MongoDB** with Mongoose ODM
- **JWT** authentication
- **WhatsApp Web.js** for bot integration
- **Bcrypt** for password hashing
- **Multer** + **Cloudinary** for image uploads

### Frontend
- **Next.js 14** (React framework)
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **Lucide React** for icons

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required software
- Node.js >= 16.x
- MongoDB >= 6.0
- npm >= 8.x
- Git
```

### 1. Clone & Setup

```bash
git clone <repository-url>
cd Fusion_Cars
```

### 2. Backend Setup

```bash
cd BE_FusionCars

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Required: MONGODB_URI, JWT_SECRET, ADMIN_REGISTRATION_KEY
```

**Environment Variables (.env):**

```env
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/fusion_cars

# JWT Secret (change this!)
JWT_SECRET=your_super_secret_jwt_key_change_this

# Admin Registration Key
ADMIN_REGISTRATION_KEY=fusion_admin_2024_secret

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# WhatsApp Bot
ENABLE_WHATSAPP_BOT=false
```

**Start Backend Server:**

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Server will run on: **http://localhost:5000**

### 3. Frontend Setup

```bash
cd FE_FusionCars

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🗄️ Database Setup

### Option 1: Local MongoDB

```bash
# Install MongoDB (macOS)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community

# Verify connection
mongosh
```

### Option 2: MongoDB Atlas (Cloud)

1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster
3. Get connection string
4. Update `MONGODB_URI` in `.env`

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fusion_cars
```

---

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
    "adminKey": "fusion_admin_2024_secret"
  }'
```

### Method 2: MongoDB Direct Insert

```javascript
// In MongoDB shell or Compass
db.admins.insertOne({
  name: "Admin User",
  email: "admin@fusioncars.com",
  phone: "+919876543210",
  password: "$2a$10$...", // Use bcrypt to hash "admin123"
  role: "super-admin",
  permissions: ["manage_cars", "manage_users", "manage_bookings", "manage_reviews", "view_analytics", "manage_admins"],
  active: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

**Login Credentials:**
- Email: `admin@fusioncars.com`
- Password: `admin123`

---

## 🤖 WhatsApp Bot Setup (Optional)

The WhatsApp bot allows admins to manage car listings via WhatsApp commands!

### Enable WhatsApp Bot

```bash
cd BE_FusionCars

# Start WhatsApp bot (separate terminal)
npm run whatsapp
```

### Setup Process

1. QR code will appear in terminal
2. Scan with WhatsApp on your phone
3. Bot will authenticate and connect
4. Add admin's WhatsApp number to database:

```javascript
// Update admin with WhatsApp number
db.admins.updateOne(
  { email: "admin@fusioncars.com" },
  {
    $set: {
      whatsappNumber: "919876543210", // Your WhatsApp number
      whatsappVerified: true
    }
  }
)
```

### WhatsApp Bot Commands

```
/help          - Show all commands
/create        - Create new car listing (guided flow)
/list [page]   - View all active listings
/update [id]   - Update car details
/delete [id]   - Delete a listing
/sold [id]     - Mark car as sold
/featured [id] - Toggle featured status
/stats         - Platform statistics
/bookings      - View pending bookings
```

**Example Usage:**

```
Admin: /create
Bot: Step 1/10 - Enter the brand:
Admin: Mercedes-Benz
Bot: Step 2/10 - Enter the model:
Admin: E-Class
... (continues through all steps)
Bot: ✅ Car Created Successfully! ID: 673abc...
```

---

## 📱 Admin Dashboard Access

### Login

1. Navigate to: **http://localhost:3000/admin/login**
2. Enter credentials:
   - Email: `admin@fusioncars.com`
   - Password: `admin123`
3. Click "Login"

### Dashboard Features

**Overview Tab:**
- Total cars, revenue, users, bookings
- Recent sales with dates and prices
- Popular brands analytics

**Cars Tab:**
- View all car listings
- Add new car (button → form)
- Edit car (pencil icon)
- Delete car (trash icon)
- Toggle featured status (star icon)

**Bookings Tab:**
- View all bookings
- Update booking status
- Contact customer details

**Reviews Tab:**
- Moderate customer reviews
- Approve/reject reviews
- View review details

---

## 🎨 Premium Features Guide

### 1. Car Comparison Tool

**Access:** http://localhost:3000/compare

**Features:**
- Compare up to 3 cars side-by-side
- Visual image comparison
- Detailed spec comparison table
- Price comparison
- Add/remove cars easily

**How to Use:**
1. Click "Add Car to Compare"
2. Select car from modal
3. Repeat for up to 3 cars
4. View comparison table below

### 2. Financing Calculator

**Integrated in:** Car detail pages, Inventory page

**Features:**
- Real-time EMI calculation
- Adjustable down payment slider
- Interest rate customization
- Multiple tenure options (1-8 years)
- Visual payment breakdown
- Principal vs Interest chart

**How to Use:**
1. Car price auto-fills
2. Adjust down payment slider
3. Select interest rate
4. Choose tenure (months)
5. See instant EMI calculation

### 3. Multi-Image Gallery

**Backend Support:**
```javascript
// Car model supports multiple images
images: [{
  url: String,
  type: 'exterior' | 'interior' | 'engine' | 'dashboard' | 'wheels',
  isPrimary: Boolean
}]
```

### 4. Review System

**For Customers:**
- Submit reviews after purchase
- Rate cars 1-5 stars
- Add photos to reviews
- Edit/delete own reviews

**For Admins:**
- Moderate all reviews
- Approve/reject submissions
- View review analytics
- Update car ratings automatically

### 5. Wishlist

**API Endpoints:**
```bash
GET    /api/wishlist           # Get user wishlist
POST   /api/wishlist/add       # Add car to wishlist
DELETE /api/wishlist/remove/:carId  # Remove from wishlist
```

---

## 🔌 API Documentation

### Base URL

```
Development: http://localhost:5000/api
Production: https://your-domain.com/api
```

### Authentication

All protected routes require JWT token in header:

```bash
Authorization: Bearer <token>
```

### Public Endpoints

#### Cars

```bash
GET    /api/cars                    # Get all cars (with filters)
GET    /api/cars/featured           # Get featured cars
GET    /api/cars/:id                # Get single car
GET    /api/cars/stats/overview     # Get car statistics
```

**Query Parameters:**
- `brand` - Filter by brand
- `fuelType` - Filter by fuel type
- `minPrice` - Minimum price
- `maxPrice` - Maximum price
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 12)
- `sort` - Sort by: `featured`, `price-low`, `price-high`, `rating`, `newest`

**Example:**
```bash
GET /api/cars?brand=Mercedes-Benz&fuelType=Diesel&sort=price-low&page=1&limit=10
```

#### Auth

```bash
POST   /api/auth/register           # User registration
POST   /api/auth/login              # User login
POST   /api/auth/admin/login        # Admin login
POST   /api/auth/admin/register     # Admin registration
```

### Protected Endpoints (User)

```bash
GET    /api/wishlist                # Get wishlist
POST   /api/wishlist/add            # Add to wishlist
DELETE /api/wishlist/remove/:carId  # Remove from wishlist

POST   /api/reviews                 # Create review
PUT    /api/reviews/:id             # Update review
DELETE /api/reviews/:id             # Delete review
GET    /api/reviews/my-reviews      # Get user's reviews
```

### Protected Endpoints (Admin)

```bash
# Car Management
POST   /api/admin/cars              # Create car
PUT    /api/admin/cars/:id          # Update car
DELETE /api/admin/cars/:id          # Delete car
PATCH  /api/admin/cars/:id/sold     # Mark as sold
PATCH  /api/admin/cars/:id/featured # Toggle featured

# Analytics
GET    /api/admin/dashboard/stats   # Dashboard statistics

# User Management
GET    /api/admin/users             # Get all users

# Booking Management
GET    /api/admin/bookings          # Get all bookings
PATCH  /api/admin/bookings/:id/status  # Update booking status

# Review Management
GET    /api/admin/reviews           # Get reviews (by status)
PATCH  /api/admin/reviews/:id/status   # Approve/reject review
```

---

## 🗃️ Data Models

### Car Model

```javascript
{
  // Basic Info
  name: String,
  brand: String,
  model: String,
  variant: String,
  year: Number,

  // Pricing
  price: Number,
  originalPrice: Number,
  negotiable: Boolean,

  // Vehicle Details
  fuelType: 'Petrol' | 'Diesel' | 'Hybrid' | 'Electric' | 'CNG',
  transmission: 'Manual' | 'Automatic' | 'Semi-Automatic',
  mileage: String,
  kmsDriven: Number,
  engineCapacity: String,
  horsepower: Number,
  torque: String,
  color: String,
  seating: Number,
  doors: Number,
  bodyType: 'Sedan' | 'SUV' | 'Hatchback' | 'Coupe' | 'Convertible',

  // Images & Media
  images: [{ url, type, isPrimary }],
  video360Url: String,
  virtualTourUrl: String,

  // Features
  features: [String],
  safetyFeatures: [String],
  comfortFeatures: [String],
  technologyFeatures: [String],

  // Condition & Inspection
  condition: 'Excellent' | 'Very Good' | 'Good' | 'Fair',
  inspectionReport: {
    inspectionDate, inspectorName, overallScore,
    exteriorCondition, interiorCondition, engineCondition,
    reportPdfUrl, notes
  },

  // History
  owners: Number,
  serviceHistory: [{ date, type, mileage, description, cost }],
  accidentHistory: { hasAccidents, accidents[] },

  // Documents
  registrationNumber: String,
  registrationState: String,
  insuranceValid: Boolean,
  insuranceExpiry: Date,

  // Location
  location: { city, state, pincode, showroom },

  // Availability
  available: Boolean,
  sold: Boolean,
  soldDate: Date,

  // Marketing
  featured: Boolean,
  trending: Boolean,
  newArrival: Boolean,
  certified: Boolean,

  // Stats
  rating: Number,
  reviewCount: Number,
  views: Number,
  inquiries: Number,

  // Admin
  createdBy: ObjectId,
  status: 'draft' | 'active' | 'sold' | 'reserved',
  timestamps: true
}
```

---

## 🎯 Comparison with BigBoyToyz

| Feature | BigBoyToyz | Fusion Cars | Winner |
|---------|-----------|-------------|---------|
| Car Listings | ✓ | ✓ Enhanced with 20+ images | **Fusion Cars** |
| Admin Panel | Basic | Advanced Dashboard + WhatsApp Bot | **Fusion Cars** |
| Car Comparison | Basic | Advanced 3-car side-by-side | **Fusion Cars** |
| Financing Calculator | Limited | Real-time with visual breakdown | **Fusion Cars** |
| 360° Views | ✓ | ✓ Framework ready | Tie |
| Inspection Reports | Limited | Comprehensive with PDF | **Fusion Cars** |
| Review System | Basic | Full moderation + approval | **Fusion Cars** |
| Mobile App | ✓ | Web responsive (App ready) | BigBoyToyz |
| Delivery Tracking | ✓ | Framework ready | BigBoyToyz |
| WhatsApp Bot | ✗ | ✓ Unique feature! | **Fusion Cars** |

**Overall Winner: Fusion Cars** 🏆

---

## 📝 Development Workflow

### Adding a New Car (Via Admin Dashboard)

1. Login to admin dashboard
2. Go to "Cars" tab
3. Click "Add New Car"
4. Fill in all details:
   - Basic info (brand, model, year)
   - Pricing details
   - Specifications
   - Images (upload to Cloudinary or use URLs)
   - Features and highlights
   - Location and availability
5. Click "Create Listing"
6. Car appears instantly on website

### Adding a New Car (Via WhatsApp Bot)

1. Open WhatsApp and message bot
2. Send `/create`
3. Follow guided flow (10 steps)
4. Bot confirms creation with ID
5. Car is live!

### Updating Car Status

**Mark as Sold:**
```bash
# Via API
PATCH /api/admin/cars/:id/sold

# Via WhatsApp
/sold [car_id]

# Via Dashboard
Click "Mark as Sold" button
```

**Toggle Featured:**
```bash
# Via API
PATCH /api/admin/cars/:id/featured

# Via WhatsApp
/featured [car_id]

# Via Dashboard
Click star icon
```

---

## 🚢 Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Create account on platform
2. Connect GitHub repository
3. Add environment variables
4. Deploy

**Environment Variables to Set:**
```
MONGODB_URI
JWT_SECRET
ADMIN_REGISTRATION_KEY
NODE_ENV=production
```

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. Navigate to frontend: `cd FE_FusionCars`
3. Run: `vercel`
4. Follow prompts
5. Set environment variables in Vercel dashboard

**Environment Variables:**
```
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

---

## 🐛 Troubleshooting

### Backend Won't Start

```bash
# Check MongoDB is running
mongosh

# Check port 5000 is free
lsof -i :5000

# Check .env file exists
ls -la | grep .env

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Frontend Won't Start

```bash
# Check port 3000 is free
lsof -i :3000

# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### WhatsApp Bot Not Connecting

```bash
# Delete session and retry
rm -rf .wwebjs_auth

# Restart bot
npm run whatsapp

# Scan new QR code
```

### Can't Login to Admin

```bash
# Check admin exists
mongosh
use fusion_cars
db.admins.find()

# Reset password (hash "admin123")
db.admins.updateOne(
  { email: "admin@fusioncars.com" },
  { $set: { password: "$2a$10$..." } }
)
```

---

## 📚 Additional Resources

### Documentation Files

- `README.md` - Project overview
- `IMPLEMENTATION_GUIDE.md` - This file
- `.env.example` - Environment template
- API documentation in code comments

### Useful Commands

```bash
# Backend
npm run dev          # Start development server
npm start            # Start production server
npm run whatsapp     # Start WhatsApp bot
npm test             # Run tests

# Frontend
npm run dev          # Start development
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

---

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [WhatsApp Web.js](https://github.com/pedroslopez/whatsapp-web.js)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

## 💡 Future Enhancements

1. **Mobile App** - React Native app
2. **Video Calling** - Virtual showroom tours
3. **Insurance Integration** - Get instant quotes
4. **Delivery Tracking** - Real-time GPS tracking
5. **AI Chatbot** - Customer support
6. **Payment Gateway** - Online payments
7. **Advanced Analytics** - Machine learning insights
8. **Multi-language** - Support multiple languages

---

## 🤝 Support

For issues or questions:
1. Check this documentation
2. Review code comments
3. Check MongoDB connection
4. Verify environment variables
5. Check console for errors

---

**Built with ❤️ for Fusion Cars**

*Last Updated: 2024*
