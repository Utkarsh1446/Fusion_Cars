# 🚀 Deployment Checklist - Fusion Cars

Quick reference guide for deploying Fusion Cars to production.

## ✅ Pre-Deployment Checklist

### Backend Prerequisites
- [ ] MongoDB database ready (MongoDB Atlas recommended)
- [ ] Backend code pushed to GitHub
- [ ] Environment variables prepared
- [ ] First admin user credentials ready

### Frontend Prerequisites
- [ ] Backend deployed and URL obtained
- [ ] Frontend code pushed to GitHub
- [ ] Vercel account created

---

## 📋 Step-by-Step Deployment

### Part 1: Deploy Backend (10 minutes)

#### Option A: Railway (Recommended - Easiest)

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Navigate to backend
cd BE_FusionCars

# 3. Login to Railway
railway login

# 4. Initialize and deploy
railway init
railway up
```

**Then in Railway Dashboard:**
1. Go to your project
2. Click "Variables" tab
3. Add these environment variables:

```
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fusion_cars
JWT_SECRET=<generate-random-string>
ADMIN_REGISTRATION_KEY=<your-secret-key>
CORS_ORIGIN=https://your-app.vercel.app
NODE_ENV=production
PORT=5000
```

4. Copy your Railway URL: `https://your-project.railway.app`

#### Option B: Render.com

1. Go to [render.com](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. **Root Directory:** `BE_FusionCars`
5. **Build Command:** `npm install`
6. **Start Command:** `npm start`
7. Add environment variables (same as Railway)
8. Click "Create Web Service"
9. Copy your Render URL

---

### Part 2: Deploy Frontend to Vercel (5 minutes)

#### Method 1: Via Dashboard (Easiest)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Project"
3. Select your GitHub repository
4. **IMPORTANT: Set Root Directory to `FE_FusionCars`**
5. Click "Deploy" (will fail - that's OK!)
6. Go to Settings → Environment Variables
7. Add:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-backend.railway.app/api
   ```
   ⚠️ Replace with your actual backend URL!
8. Go to Deployments → Click "..." → "Redeploy"

#### Method 2: Via CLI

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Navigate to frontend
cd FE_FusionCars

# 3. Login
vercel login

# 4. Deploy
vercel

# 5. When prompted, set environment variable:
# NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api

# 6. Deploy to production
vercel --prod
```

---

### Part 3: Update Backend CORS (2 minutes)

After getting your Vercel URL, update backend:

**In Railway/Render Dashboard:**
1. Go to Environment Variables
2. Update `CORS_ORIGIN`:
   ```
   CORS_ORIGIN=http://localhost:3000,https://your-app.vercel.app
   ```
3. Save and redeploy

---

### Part 4: Create Admin User (1 minute)

```bash
curl -X POST https://your-backend.railway.app/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@fusioncars.com",
    "phone": "+919876543210",
    "password": "admin123",
    "role": "super-admin",
    "permissions": ["manage_cars", "manage_users", "manage_bookings", "manage_reviews", "view_analytics"],
    "adminKey": "YOUR_ADMIN_KEY_FROM_ENV"
  }'
```

Replace:
- `your-backend.railway.app` with your actual backend URL
- `YOUR_ADMIN_KEY_FROM_ENV` with your actual admin key

---

## 🧪 Testing Deployment

### Test Backend

```bash
# Health check
curl https://your-backend.railway.app/api/health

# Should return:
# {"status":"Server is running","database":"Connected","timestamp":"..."}

# Test cars endpoint
curl https://your-backend.railway.app/api/cars
```

### Test Frontend

Visit these URLs:

- [ ] `https://your-app.vercel.app` - Home page loads
- [ ] `https://your-app.vercel.app/inventory` - Cars display
- [ ] `https://your-app.vercel.app/compare` - Comparison tool works
- [ ] `https://your-app.vercel.app/admin/login` - Admin login page

### Test Admin Login

1. Go to: `https://your-app.vercel.app/admin/login`
2. Email: `admin@fusioncars.com`
3. Password: `admin123`
4. Should redirect to dashboard

---

## 🔧 Environment Variables Reference

### Backend (Railway/Render)

| Variable | Required | Example |
|----------|----------|---------|
| `MONGODB_URI` | ✅ Yes | `mongodb+srv://user:pass@cluster.mongodb.net/fusion_cars` |
| `JWT_SECRET` | ✅ Yes | `abc123xyz789...` (random string) |
| `ADMIN_REGISTRATION_KEY` | ✅ Yes | `my_secret_admin_key` |
| `CORS_ORIGIN` | ✅ Yes | `http://localhost:3000,https://app.vercel.app` |
| `NODE_ENV` | ✅ Yes | `production` |
| `PORT` | ✅ Yes | `5000` |
| `EMAIL_HOST` | ❌ No | `smtp.gmail.com` |
| `EMAIL_USER` | ❌ No | `your-email@gmail.com` |
| `CLOUDINARY_CLOUD_NAME` | ❌ No | `your-cloud-name` |

### Frontend (Vercel)

| Variable | Required | Example |
|----------|----------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ Yes | `https://your-backend.railway.app/api` |

---

## 🐛 Common Issues & Solutions

### Issue: "Network Error" on frontend

**Solution:**
1. Check backend is running: Visit `https://your-backend.railway.app/api/health`
2. Verify `NEXT_PUBLIC_API_URL` is set in Vercel
3. Redeploy frontend after adding env var

### Issue: CORS Error

**Solution:**
1. Add your Vercel URL to `CORS_ORIGIN` in backend
2. Format: `https://your-app.vercel.app` (no trailing slash)
3. Redeploy backend

### Issue: Admin login fails

**Solution:**
1. Verify admin user was created successfully
2. Check backend logs for errors
3. Test backend endpoint directly

### Issue: Database connection fails

**Solution:**
1. Check MongoDB Atlas IP whitelist (allow all: `0.0.0.0/0`)
2. Verify connection string is correct
3. Ensure database user has proper permissions

---

## 📊 Deployment Timeline

| Step | Time | Status |
|------|------|--------|
| Backend deployment | 10 min | ⏳ |
| Frontend deployment | 5 min | ⏳ |
| CORS configuration | 2 min | ⏳ |
| Admin user creation | 1 min | ⏳ |
| Testing | 5 min | ⏳ |
| **Total** | **~23 min** | |

---

## ✅ Post-Deployment Checklist

- [ ] Backend health check passes
- [ ] Frontend home page loads
- [ ] Car inventory displays
- [ ] Admin login works
- [ ] Admin dashboard loads
- [ ] No console errors in browser
- [ ] Images load correctly
- [ ] Forms submit successfully
- [ ] Mobile view works

---

## 🎯 Quick Commands

### Generate JWT Secret

```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Check Backend Status

```bash
curl https://your-backend.railway.app/api/health
```

### View Vercel Logs

```bash
vercel logs
```

### Redeploy Frontend

```bash
vercel --prod
```

---

## 📞 Support Resources

- [Railway Docs](https://docs.railway.app/)
- [Vercel Docs](https://vercel.com/docs)
- [MongoDB Atlas Docs](https://docs.atlas.mongodb.com/)
- Project Guide: [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)
- Vercel Guide: [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ Backend health endpoint returns 200 OK
✅ Frontend loads without errors
✅ Admin can login
✅ Cars display on inventory page
✅ No CORS errors in browser console
✅ Images load properly
✅ All pages accessible

---

**Time to deploy: ~20 minutes**

**Estimated cost: $0 (using free tiers)**

**Ready to go live? Follow the steps above!** 🚀
