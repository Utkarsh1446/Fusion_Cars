# Fusion Cars - Troubleshooting Guide

Common deployment issues and their solutions.

---

## 🔴 Frontend Issues

### Issue: Blank white screen / Nothing loads

**Symptoms:**
- Frontend deploys successfully
- But shows blank white page
- Browser console shows errors

**Solutions:**

1. **Check environment variable:**
   ```bash
   # In Vercel dashboard:
   Settings → Environment Variables

   # Verify NEXT_PUBLIC_API_URL is set
   # Must be: https://your-backend.railway.app/api
   ```

2. **Redeploy after adding env var:**
   - Vercel doesn't auto-redeploy when you add env vars
   - Go to Deployments → "..." → Redeploy

3. **Check browser console:**
   - Open DevTools (F12)
   - Look for errors
   - Common: "Failed to fetch" = wrong API URL

---

### Issue: "Network Error" or "Failed to fetch"

**Symptoms:**
- Frontend loads but no data appears
- Console shows network errors
- API calls failing

**Solutions:**

1. **Verify backend is running:**
   ```bash
   curl https://your-backend.railway.app/api/health

   # Should return:
   # {"status":"Server is running","database":"Connected"}
   ```

2. **Check API URL format:**
   ```bash
   # ✅ Correct:
   NEXT_PUBLIC_API_URL=https://backend.railway.app/api

   # ❌ Wrong:
   NEXT_PUBLIC_API_URL=http://backend.railway.app/api  # (http not https)
   NEXT_PUBLIC_API_URL=https://backend.railway.app/api/ # (trailing slash)
   NEXT_PUBLIC_API_URL=https://backend.railway.app     # (missing /api)
   ```

3. **Test API directly:**
   ```bash
   # Test from command line
   curl https://your-backend.railway.app/api/cars

   # Should return JSON with cars data
   ```

---

### Issue: CORS Error

**Symptoms:**
- Browser console shows: "CORS policy blocked"
- API calls fail with CORS error
- Network tab shows OPTIONS requests failing

**Solutions:**

1. **Update CORS_ORIGIN in backend:**
   ```bash
   # In Railway/Render dashboard:
   # Add your Vercel URL to CORS_ORIGIN

   CORS_ORIGIN=http://localhost:3000,https://your-app.vercel.app
   ```

2. **No trailing slash:**
   ```bash
   # ✅ Correct:
   https://your-app.vercel.app

   # ❌ Wrong:
   https://your-app.vercel.app/
   ```

3. **Redeploy backend:**
   - After updating CORS_ORIGIN
   - Trigger a redeploy in Railway/Render

4. **Check CORS in browser:**
   ```javascript
   // In browser console:
   console.log('Testing CORS...');
   fetch('https://your-backend.railway.app/api/health')
     .then(r => r.json())
     .then(data => console.log('Success!', data))
     .catch(err => console.error('CORS Error:', err));
   ```

---

### Issue: Admin login doesn't work

**Symptoms:**
- Admin login page loads
- Enter credentials and click login
- Nothing happens or shows error

**Solutions:**

1. **Create admin user first:**
   ```bash
   curl -X POST https://your-backend.railway.app/api/auth/admin/register \
     -H "Content-Type: application/json" \
     -d '{
       "name": "Admin",
       "email": "admin@fusioncars.com",
       "password": "admin123",
       "phone": "+919876543210",
       "role": "super-admin",
       "permissions": ["manage_cars","manage_users","manage_bookings","manage_reviews","view_analytics"],
       "adminKey": "YOUR_ADMIN_KEY_FROM_ENV"
     }'
   ```

2. **Check response:**
   - Should return success message
   - If error, check adminKey matches your env var

3. **Test login endpoint:**
   ```bash
   curl -X POST https://your-backend.railway.app/api/auth/admin/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@fusioncars.com",
       "password": "admin123"
     }'

   # Should return token and admin data
   ```

---

### Issue: Images not loading

**Symptoms:**
- Car images show broken image icon
- Browser console shows image load errors

**Solutions:**

1. **Update next.config.js:**
   ```javascript
   // Add your image domain
   images: {
     domains: [
       'images.unsplash.com',
       'via.placeholder.com',
       'res.cloudinary.com',
       'your-image-cdn.com'  // Add your domain
     ],
   }
   ```

2. **Redeploy frontend:**
   - Changes to next.config.js require redeploy

3. **Use `unoptimized: true` for external images:**
   ```javascript
   images: {
     unoptimized: true,  // For external CDNs
     domains: [...]
   }
   ```

---

## 🔴 Backend Issues

### Issue: Backend won't start / Crashes

**Symptoms:**
- Railway/Render shows "Crashed"
- Logs show errors
- Health endpoint returns 503

**Solutions:**

1. **Check logs:**
   ```bash
   # In Railway:
   railway logs

   # In Render:
   View logs in dashboard
   ```

2. **Common errors:**

   **MongoDB connection failed:**
   ```
   Error: MongoNetworkError
   ```
   **Fix:**
   - Go to MongoDB Atlas
   - Network Access → Add IP Address
   - Allow all: `0.0.0.0/0`
   - Wait 2-3 minutes for changes to propagate

   **Missing environment variables:**
   ```
   Error: JWT_SECRET is required
   ```
   **Fix:**
   - Add all required env vars in Railway/Render
   - Must have: MONGODB_URI, JWT_SECRET, NODE_ENV

3. **Test locally first:**
   ```bash
   cd BE_FusionCars
   npm install
   npm run dev

   # Should start without errors
   ```

---

### Issue: Database connection fails

**Symptoms:**
- Backend starts but can't connect to MongoDB
- Logs show: "MongoServerError" or "ECONNREFUSED"

**Solutions:**

1. **Check MongoDB Atlas IP whitelist:**
   - Go to MongoDB Atlas
   - Network Access
   - Add IP: `0.0.0.0/0` (allow all)

2. **Verify connection string:**
   ```bash
   # Should look like:
   mongodb+srv://username:password@cluster.mongodb.net/fusion_cars

   # Common mistakes:
   # - Wrong password (check for special characters)
   # - Wrong database name
   # - Missing retryWrites parameter
   ```

3. **Test connection string:**
   ```bash
   # Using mongosh:
   mongosh "mongodb+srv://username:password@cluster.mongodb.net/fusion_cars"
   ```

4. **Create database user:**
   - MongoDB Atlas → Database Access
   - Add Database User
   - Give read/write permissions

---

### Issue: 502 Bad Gateway

**Symptoms:**
- Frontend works
- But API calls return 502
- Backend shows as running

**Solutions:**

1. **Check backend health:**
   ```bash
   curl https://your-backend.railway.app/api/health
   ```

2. **Restart backend:**
   - Railway: Redeploy
   - Render: Manual Deploy

3. **Check backend logs:**
   - Look for uncaught errors
   - Database connection issues
   - Memory issues

---

## 🔴 Build Issues

### Issue: Vercel build fails

**Symptoms:**
- Vercel deployment fails
- Build logs show errors

**Solutions:**

1. **Check Root Directory:**
   ```
   Vercel Settings → General → Root Directory
   Must be: FE_FusionCars
   ```

2. **Common build errors:**

   **Module not found:**
   ```
   Error: Cannot find module 'xyz'
   ```
   **Fix:**
   ```bash
   cd FE_FusionCars
   npm install xyz --save
   git add package.json package-lock.json
   git commit -m "Add missing dependency"
   git push
   ```

   **ESLint errors:**
   ```
   Error: ESLint found problems
   ```
   **Fix (temporary):**
   ```javascript
   // next.config.js
   eslint: {
     ignoreDuringBuilds: true,  // Skip ESLint during builds
   }
   ```

3. **Test build locally:**
   ```bash
   cd FE_FusionCars
   npm run build

   # Should complete without errors
   ```

---

### Issue: Railway/Render build fails

**Symptoms:**
- Backend deployment fails
- Build logs show npm errors

**Solutions:**

1. **Check Node version:**
   ```json
   // package.json
   "engines": {
     "node": ">=16.0.0"
   }
   ```

2. **Install dependencies:**
   ```bash
   cd BE_FusionCars
   rm -rf node_modules package-lock.json
   npm install
   git add .
   git commit -m "Update dependencies"
   git push
   ```

3. **Check build command:**
   - Railway: Auto-detects `npm install`
   - Render: Set to `npm install`

---

## 🔴 Environment Variable Issues

### Issue: Environment variables not working

**Symptoms:**
- Variables set but not accessible
- `undefined` when trying to use them

**Solutions:**

1. **Frontend variables must start with NEXT_PUBLIC_:**
   ```bash
   # ✅ Correct (accessible in browser):
   NEXT_PUBLIC_API_URL=https://...

   # ❌ Wrong (not accessible):
   API_URL=https://...
   ```

2. **Redeploy after adding variables:**
   - Vercel: Doesn't auto-redeploy
   - Railway: Might need manual redeploy

3. **Check variable in browser:**
   ```javascript
   // Browser console:
   console.log(process.env.NEXT_PUBLIC_API_URL);
   ```

4. **Check variable in backend:**
   ```javascript
   // Add to backend code temporarily:
   console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
   ```

---

## 🔴 MongoDB Issues

### Issue: Database shows as empty

**Symptoms:**
- Backend connects successfully
- But no data appears
- Collections not created

**Solutions:**

1. **Create admin user:**
   - Creates first document
   - Initializes collections

2. **Check database name:**
   ```bash
   # Connection string should specify database:
   mongodb+srv://user:pass@cluster.mongodb.net/fusion_cars
   #                                              ^^^^^^^^^^^
   #                                              Database name
   ```

3. **Use MongoDB Compass:**
   - Download MongoDB Compass
   - Connect with your connection string
   - Verify collections exist

---

## 🆘 Emergency Debugging

### Quick Diagnostic Checklist

Run these commands to diagnose issues:

```bash
# 1. Test backend health
curl https://your-backend.railway.app/api/health

# 2. Test backend cars endpoint
curl https://your-backend.railway.app/api/cars

# 3. Check frontend loads
curl -I https://your-app.vercel.app

# 4. Test MongoDB connection
mongosh "YOUR_MONGODB_URI"

# 5. Check Vercel env vars
# Go to: Vercel Dashboard → Settings → Environment Variables

# 6. Check Railway env vars
railway variables
```

### Get Logs

```bash
# Vercel logs
vercel logs

# Railway logs
railway logs

# MongoDB Atlas logs
# Go to: Atlas Dashboard → Logs
```

---

## 📞 Still Having Issues?

1. **Check documentation:**
   - [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
   - [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)
   - [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)

2. **Verify all URLs:**
   - Backend URL (no trailing slash)
   - Frontend URL (no trailing slash)
   - MongoDB URI (correct database name)

3. **Test locally first:**
   - Make sure it works on localhost
   - Then deploy to production

4. **Common mistakes:**
   - Forgot to redeploy after env var changes
   - Wrong Root Directory in Vercel
   - CORS_ORIGIN doesn't include Vercel URL
   - MongoDB IP not whitelisted

---

**Most issues are fixed by:**
1. Double-checking environment variables
2. Redeploying after changes
3. Verifying CORS configuration
4. Checking MongoDB connection

**Good luck! 🚀**
