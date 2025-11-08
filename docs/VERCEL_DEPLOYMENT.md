# Vercel Deployment Guide - Fusion Cars Frontend

## 🚀 Quick Deployment Steps

### Step 1: Deploy Backend First

Before deploying the frontend to Vercel, you need a live backend API. Deploy your backend to:
- **Railway** (Recommended - Free tier available)
- **Render** (Free tier available)
- **Heroku** (Paid)
- **DigitalOcean** (Paid)

**Example Backend URL:** `https://your-backend.railway.app`

### Step 2: Prepare Frontend for Vercel

The frontend is now configured with environment variables. You just need to set them in Vercel.

### Step 3: Deploy to Vercel

#### Option A: Via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the **FE_FusionCars** folder as root directory
5. Configure environment variables (see below)
6. Click "Deploy"

#### Option B: Via Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd FE_FusionCars

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts and set environment variables
```

### Step 4: Configure Environment Variables in Vercel

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

**Required:**
```
NEXT_PUBLIC_API_URL = https://your-backend-url.com/api
```

**Example:**
```
NEXT_PUBLIC_API_URL = https://fusion-cars-backend.railway.app/api
```

**Important:**
- ✅ Use HTTPS (not HTTP) for production
- ✅ Don't include trailing slash
- ✅ Include `/api` at the end
- ❌ Don't use localhost

### Step 5: Redeploy

After adding environment variables:
1. Go to Deployments tab
2. Click "..." on latest deployment
3. Click "Redeploy"

---

## 🔧 Troubleshooting

### Issue: "Network Error" or API calls failing

**Solution:** Backend is not deployed or URL is incorrect

1. Deploy your backend first
2. Update `NEXT_PUBLIC_API_URL` in Vercel environment variables
3. Make sure backend accepts requests from your Vercel domain
4. Update CORS settings in backend:

```javascript
// BE_FusionCars/src/index.js
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://your-vercel-app.vercel.app',
    'https://your-custom-domain.com'
  ],
  credentials: true
}));
```

### Issue: Admin dashboard not loading

**Solution:** Client-side localStorage issue

The admin pages are now fixed to handle server-side rendering. Make sure you've committed the latest changes.

### Issue: Build fails on Vercel

**Check these:**

1. **Root Directory:** Make sure Vercel is building from `FE_FusionCars` folder
   - In Vercel settings → General → Root Directory → `FE_FusionCars`

2. **Node Version:** Ensure compatible Node version
   - Add this to `package.json`:
   ```json
   "engines": {
     "node": ">=16.0.0"
   }
   ```

3. **Build Command:** Should be `next build`
   - Vercel auto-detects this for Next.js

4. **Dependencies:** Make sure all dependencies are in `dependencies`, not `devDependencies`

### Issue: Images not loading

**Solution:** Update image domains in `next.config.js`

```javascript
// next.config.js
module.exports = {
  images: {
    unoptimized: true,
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
      'your-image-cdn.com'
    ],
  },
}
```

### Issue: 404 on page refresh

**Solution:** This shouldn't happen with Next.js, but if it does:

Make sure you're using Next.js Link component for navigation:
```jsx
import Link from 'next/link';

// ✅ Good
<Link href="/admin">Admin</Link>

// ❌ Bad
<a href="/admin">Admin</a>
```

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure:

- [ ] Backend is deployed and accessible
- [ ] Backend URL is HTTPS
- [ ] Backend CORS allows your Vercel domain
- [ ] MongoDB is accessible from backend (use MongoDB Atlas for cloud)
- [ ] Environment variables are set in Vercel
- [ ] Build works locally (`npm run build`)
- [ ] All API calls use `API_ENDPOINTS` from config
- [ ] No hardcoded localhost URLs

---

## 🏗️ Recommended Architecture

```
┌─────────────────────┐
│   Vercel (Frontend) │
│   fusion-cars.app   │
└──────────┬──────────┘
           │
           │ API Calls (HTTPS)
           │
┌──────────▼──────────┐
│  Railway (Backend)  │
│  Express + Node.js  │
└──────────┬──────────┘
           │
           │ MongoDB Connection
           │
┌──────────▼──────────┐
│   MongoDB Atlas     │
│   (Cloud Database)  │
└─────────────────────┘
```

---

## 🌐 Backend Deployment Options

### Railway (Recommended - Easiest)

```bash
# Install Railway CLI
npm i -g @railway/cli

# Navigate to backend
cd BE_FusionCars

# Login
railway login

# Initialize
railway init

# Add MongoDB
railway add

# Deploy
railway up

# Set environment variables in Railway dashboard
```

**Set these environment variables in Railway:**
```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fusion_cars
JWT_SECRET=your_secret_key_here
ADMIN_REGISTRATION_KEY=admin_secret_key
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://your-vercel-app.vercel.app
```

### Render.com

1. Create account at render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Select `BE_FusionCars` as root
5. Build Command: `npm install`
6. Start Command: `npm start`
7. Add environment variables
8. Click "Create Web Service"

---

## 🔐 Security Best Practices

1. **Never commit `.env` files**
   - Use `.env.example` as template
   - Set actual values in Vercel/Railway dashboard

2. **Use strong secrets**
   ```bash
   # Generate random JWT secret
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

3. **Enable HTTPS only**
   - Vercel handles this automatically
   - For backend, Railway/Render provide HTTPS

4. **Configure CORS properly**
   - Only allow your frontend domains
   - Don't use `*` in production

---

## 📊 Post-Deployment Testing

Test these URLs after deployment:

```bash
# Frontend (Vercel)
https://your-app.vercel.app
https://your-app.vercel.app/admin/login
https://your-app.vercel.app/compare

# Backend (Railway)
https://your-backend.railway.app/api/health
https://your-backend.railway.app/api/cars
```

---

## 🎯 Common Deployment Issues & Solutions

| Issue | Solution |
|-------|----------|
| API calls return CORS error | Add Vercel domain to backend CORS settings |
| Build succeeds but site is blank | Check browser console for errors, verify API_URL |
| Admin login doesn't work | Ensure backend is running and accessible |
| Images don't load | Add image domains to next.config.js |
| Database connection fails | Use MongoDB Atlas, check connection string |
| Environment variables not working | Redeploy after adding env vars |

---

## 🚀 Deployment Commands Summary

```bash
# Frontend (Vercel)
cd FE_FusionCars
vercel --prod

# Backend (Railway)
cd BE_FusionCars
railway up

# Test build locally before deploying
npm run build
npm start
```

---

## 📞 Need Help?

1. Check Vercel deployment logs
2. Check Railway/Render backend logs
3. Test API endpoints with Postman
4. Verify environment variables are set
5. Check browser console for errors

---

## ✅ Successful Deployment Indicators

- ✅ Frontend loads at your Vercel URL
- ✅ Backend health check returns 200: `https://your-backend/api/health`
- ✅ Cars load on inventory page
- ✅ Admin login works
- ✅ No console errors
- ✅ Images display correctly

---

**Your frontend is now configured and ready to deploy to Vercel!** 🎉

Just remember to:
1. Deploy backend first
2. Set NEXT_PUBLIC_API_URL in Vercel
3. Update CORS in backend
4. Redeploy after adding env vars
