# Fusion Cars - Frontend

Premium car reselling platform frontend built with Next.js 14.

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.local.example .env.local

# Start development server
npm run dev
```

Open http://localhost:3000

## 📦 Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

For production on Vercel, set in Vercel dashboard:

```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api
```

## 🏗️ Build

```bash
# Production build
npm run build

# Start production server
npm start
```

## 🚢 Deploy to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. Push code to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your repository
4. **Set Root Directory to:** `FE_FusionCars`
5. Add environment variable:
   - Name: `NEXT_PUBLIC_API_URL`
   - Value: `https://your-backend-url.com/api`
6. Click Deploy

### Option 2: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Set environment variables when prompted
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.example.com/api` |

### Important Notes

- ✅ Variable must start with `NEXT_PUBLIC_` to be accessible in browser
- ✅ Don't include trailing slash in URL
- ✅ Include `/api` at the end of the base URL
- ❌ Don't use `http://localhost` in production

## 📱 Features

### Public Pages
- `/` - Home page with featured cars
- `/inventory` - Browse all cars with filters
- `/about` - About the company
- `/contact` - Contact form
- `/compare` - Compare up to 3 cars side-by-side

### Admin Pages
- `/admin/login` - Admin authentication
- `/admin` - Admin dashboard with analytics

### Premium Components
- **Car Comparison** - Side-by-side comparison tool
- **Financing Calculator** - Real-time EMI calculator
- **Admin Dashboard** - Full CRUD operations

## 🎨 Tech Stack

- **Next.js 14** - React framework
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Lucide React** - Icons

## 📝 Scripts

```bash
npm run dev          # Start development server (port 3000)
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## 🐛 Troubleshooting

### Issue: API calls fail

**Solution:** Check environment variable is set correctly

```bash
# Check current env var
echo $NEXT_PUBLIC_API_URL

# Or check in browser console
console.log(process.env.NEXT_PUBLIC_API_URL)
```

### Issue: Build fails on Vercel

**Solutions:**

1. Ensure Root Directory is set to `FE_FusionCars` in Vercel settings
2. Check all dependencies are in `dependencies` (not `devDependencies`)
3. Review Vercel build logs for specific errors

### Issue: Admin dashboard shows "Loading..." forever

**Solutions:**

1. Backend is not running - deploy backend first
2. CORS error - add your Vercel domain to backend CORS settings
3. Environment variable not set - add `NEXT_PUBLIC_API_URL` in Vercel

### Issue: Images not loading

**Solution:** Add image domains to `next.config.js`

```javascript
images: {
  domains: ['your-image-cdn.com', 'images.unsplash.com'],
}
```

## 🔗 Related Documentation

- [VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md) - Detailed deployment guide
- [IMPLEMENTATION_GUIDE.md](../IMPLEMENTATION_GUIDE.md) - Complete project guide
- [PROJECT_SUMMARY.md](../PROJECT_SUMMARY.md) - Feature overview

## 📞 API Endpoints Used

All API endpoints are configured in `src/config/api.js`:

```javascript
import { API_ENDPOINTS } from './config/api';

// Examples:
API_ENDPOINTS.cars           // GET /api/cars
API_ENDPOINTS.adminLogin     // POST /api/auth/admin/login
API_ENDPOINTS.adminDashboard // GET /api/admin/dashboard/stats
```

## 🎯 Development Tips

### Adding New API Endpoint

1. Add to `src/config/api.js`:
```javascript
export const API_ENDPOINTS = {
  // ... existing endpoints
  newEndpoint: `${API_BASE_URL}/new-endpoint`,
};
```

2. Use in component:
```javascript
import { API_ENDPOINTS } from '../config/api';

const response = await fetch(API_ENDPOINTS.newEndpoint);
```

### Creating New Page

```bash
# Create new page
touch src/pages/new-page.jsx

# Page will be available at /new-page
```

### Adding New Component

```bash
# Create component
touch src/components/NewComponent.jsx

# Import in page
import NewComponent from '../components/NewComponent';
```

## 🏆 Best Practices

1. **Always use API_ENDPOINTS** - Never hardcode URLs
2. **Check for window** - Use `typeof window !== 'undefined'` for client-only code
3. **Handle loading states** - Show loading UI while fetching
4. **Error handling** - Always catch and display errors
5. **Responsive design** - Test on mobile, tablet, desktop

## 📊 Performance

Build output shows optimized bundle sizes:

```
Route (pages)                Size     First Load JS
┌ ○ /                       6.56 kB  126 kB
├ ○ /admin                  4.48 kB  118 kB
├ ○ /compare                4.63 kB  124 kB
└ ○ /inventory              4.75 kB  124 kB
```

All pages are statically generated for best performance.

## 🔐 Security

- ✅ Environment variables for sensitive data
- ✅ JWT tokens for authentication
- ✅ Client-side validation
- ✅ HTTPS only in production
- ✅ CORS configured properly

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ for Fusion Cars**

For deployment help, see [VERCEL_DEPLOYMENT.md](../VERCEL_DEPLOYMENT.md)
