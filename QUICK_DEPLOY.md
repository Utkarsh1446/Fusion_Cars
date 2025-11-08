# 🚀 Quick Deploy - Fusion Cars

**Deploy your entire platform in 3 commands! (20 minutes total)**

---

## Prerequisites

- GitHub account
- Vercel account (free)
- Railway account (free)
- MongoDB Atlas account (free)

---

## 🎯 Deploy Backend (Railway) - 5 commands

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login to Railway
railway login

# 3. Navigate to backend
cd BE_FusionCars

# 4. Initialize Railway project
railway init

# 5. Deploy!
railway up
```

**Then set these variables in Railway dashboard:**

```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fusion_cars
JWT_SECRET=your_random_secret_key_here
ADMIN_REGISTRATION_KEY=your_admin_secret
CORS_ORIGIN=https://your-app.vercel.app
NODE_ENV=production
```

📝 **Save your Railway URL:** `https://your-project.railway.app`

---

## 🎯 Deploy Frontend (Vercel) - Via Dashboard

### Step 1: Deploy
1. Go to **[vercel.com/new](https://vercel.com/new)**
2. Import your GitHub repo
3. **Root Directory:** `FE_FusionCars` ⚠️
4. Click **Deploy**

### Step 2: Add Environment Variable
1. **Settings** → **Environment Variables**
2. Add:
   ```
   Name: NEXT_PUBLIC_API_URL
   Value: https://your-project.railway.app/api
   ```
3. Save

### Step 3: Redeploy
1. **Deployments** → Click **"..."** → **Redeploy**

✅ **Done!** Your site is live at: `https://your-app.vercel.app`

---

## 🎯 Create Admin User - 1 command

```bash
curl -X POST https://your-project.railway.app/api/auth/admin/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@fusioncars.com",
    "password": "admin123",
    "phone": "+919876543210",
    "role": "super-admin",
    "permissions": ["manage_cars","manage_users","manage_bookings","manage_reviews","view_analytics"],
    "adminKey": "your_admin_secret"
  }'
```

🔑 **Login at:** `https://your-app.vercel.app/admin`
- Email: `admin@fusioncars.com`
- Password: `admin123`

---

## ✅ Verify Deployment

Test these URLs (replace with your actual URLs):

```bash
# Backend health
curl https://your-project.railway.app/api/health

# Frontend
https://your-app.vercel.app

# Admin panel
https://your-app.vercel.app/admin/login
```

---

## 🐛 Common Issues

### ❌ "Network Error"
**Fix:** Check `NEXT_PUBLIC_API_URL` in Vercel environment variables

### ❌ CORS Error
**Fix:** Update `CORS_ORIGIN` in Railway to include your Vercel URL

### ❌ Can't login
**Fix:** Create admin user first (see command above)

### ❌ Database error
**Fix:** MongoDB Atlas → Network Access → Add IP `0.0.0.0/0`

---

## 🎉 You're Live!

Your platform is now deployed:

- ✅ Frontend on Vercel (global CDN, auto-scaling)
- ✅ Backend on Railway (auto-deploy on git push)
- ✅ Database on MongoDB Atlas (cloud-hosted)
- ✅ Admin panel accessible
- ✅ All features working

**Total time:** ~20 minutes
**Total cost:** $0 (free tiers)

---

## 📚 Next Steps

1. Add your first car listing via admin panel
2. Customize branding and colors
3. Set up custom domain (optional)
4. Enable WhatsApp bot (optional)

---

## 🆘 Need Help?

- **Quick Guide:** [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)
- **Full Guide:** [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
- **Vercel Details:** [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md)

---

**Happy deploying! 🚀**
