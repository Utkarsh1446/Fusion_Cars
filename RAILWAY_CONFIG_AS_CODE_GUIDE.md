# 📋 Railway Config-as-Code Setup Guide

**Using `railway.toml` for Infrastructure-as-Code Deployment**

---

## 🎯 WHAT IS CONFIG-AS-CODE?

Railway's config-as-code feature allows you to define your entire infrastructure in a `railway.toml` file instead of configuring everything manually in the dashboard.

**Benefits:**
- ✅ Version control for infrastructure
- ✅ Reproducible deployments
- ✅ Team collaboration
- ✅ Infrastructure as code best practices
- ✅ Easy rollbacks and updates

---

## 📁 FILE LOCATION

The `railway.toml` file should be placed:

```
BE_FusionCars/
├── railway.toml          ← Here!
├── package.json
├── src/
├── config/
└── ...
```

**File is already created at**: `BE_FusionCars/railway.toml`

---

## 🚀 HOW TO USE IN RAILWAY

### Option 1: Upload via Railroad CLI (Recommended)

```bash
# Install Railway CLI (if not already installed)
npm install -g @railway/cli

# Login to Railway
railway login

# Navigate to your project
cd "D:\Utkarsh\Fusion_Cars\BE_FusionCars"

# Deploy using the config file
railway up
```

### Option 2: Through Railway Dashboard

1. **Push code with railway.toml to GitHub**
   ```bash
   cd "D:\Utkarsh\Fusion_Cars"
   git add .
   git commit -m "Add Railway config-as-code"
   git push origin main
   ```

2. **Go to Railway Dashboard**
   - Visit: https://railway.app/dashboard
   - Click your project

3. **Enable Config-as-Code**
   - Go to: Settings → Config as Code
   - Toggle: Enable "Use railway.toml"
   - Railway will automatically use the file

4. **Redeploy**
   - Railway detects the file
   - Uses configuration from railway.toml
   - Applies all settings automatically

### Option 3: Manual Configuration

If Railway dashboard auto-detects the file:
1. Push code with `railway.toml` to GitHub
2. Railway automatically detects it
3. Uses the configuration for deployment
4. No manual steps needed

---

## 📋 WHAT'S IN THE railway.toml FILE

### [build] Section
```toml
[build]
builder = "nixpacks"  # Build system (automatic)

[build.env]
NODE_ENV = "production"  # Production environment
NPM_FLAGS = "--production"  # Production npm flags
```

**What it does:**
- Tells Railway to use Nixpacks (automatic detection for Node.js)
- Sets production environment
- Optimizes npm installation

---

### [deploy] Section
```toml
[deploy]
healthchecks = {enabled = true, path = "/api/health"}
restartPolicyType = "on_failure"
restartPolicyMaxRetries = 3
```

**What it does:**
- **Health Checks**: Regularly checks if app is running via `/api/health` endpoint
- **Auto-Restart**: Automatically restarts if the service crashes
- **Max Retries**: Retries up to 3 times before giving up

**Benefits:**
- ✅ Automatic recovery from crashes
- ✅ Zero-downtime if temporary failure
- ✅ Continuous monitoring

---

### [start] Section
```toml
[start]
cmd = "npm start"
port = 5000
```

**What it does:**
- **Command**: Tells Railway how to start your app (`npm start`)
- **Port**: Exposes port 5000 to the internet

**Note**: Must match your backend code!

---

### [variables] Section
```toml
[variables]
NODE_ENV = "production"
PORT = "5000"
MONGODB_URI = "mongodb+srv://..."
JWT_SECRET = "b433550cf..."
FRONTEND_URL = "https://fusion-cars.vercel.app"
ADMIN_REGISTRATION_KEY = "9af7861c..."
CORS_ORIGIN = "https://fusion-cars.vercel.app,..."
```

**What it does:**
- Sets all 7 environment variables
- No need to add them manually in dashboard
- All values stored in one place

**Update these values:**
1. `MONGODB_URI`: Your MongoDB Atlas connection string
2. `FRONTEND_URL`: Your Vercel frontend URL (after deployment)
3. `CORS_ORIGIN`: Your Vercel URL for CORS
4. Keep `JWT_SECRET` and `ADMIN_REGISTRATION_KEY` secure!

---

## 🔧 CUSTOMIZING THE FILE

### If Using Local MongoDB

Replace this section in `[variables]`:
```toml
# Current (MongoDB Atlas):
MONGODB_URI = "mongodb+srv://fusionuser:FusionPass123@fusiondb.mongodb.net/fusion-cars?retryWrites=true&w=majority"

# For local MongoDB:
MONGODB_URI = "mongodb://localhost:27017/fusion-cars"
```

### If Using Different Database

Edit the `MONGODB_URI` value:
```toml
# PostgreSQL Example:
DATABASE_URL = "postgresql://user:password@localhost:5432/fusion-cars"

# MySQL Example:
DATABASE_URL = "mysql://user:password@localhost:3306/fusion-cars"
```

### Add More Environment Variables

If you need additional variables:
```toml
[variables]
# Existing variables...
NODE_ENV = "production"
PORT = "5000"

# Add your new variables:
NEW_VARIABLE = "value"
ANOTHER_VARIABLE = "another-value"
```

### Enable Email Configuration

Uncomment the email section:
```toml
[variables]
# Existing variables...

# Uncomment and fill in:
EMAIL_HOST = "smtp.gmail.com"
EMAIL_PORT = "587"
EMAIL_USER = "your-email@gmail.com"
EMAIL_PASS = "your-app-password"
ADMIN_EMAIL = "admin@fusioncars.in"
```

---

## 📊 DEPLOYMENT FLOW WITH CONFIG-AS-CODE

```
You push code with railway.toml to GitHub
            ↓
Railway detects railway.toml file
            ↓
Railway reads configuration from file
            ↓
Railway applies all settings automatically:
  - Build configuration
  - Start command
  - Port settings
  - Environment variables
  - Health checks
  - Restart policies
            ↓
Railway builds and deploys your app
            ↓
App starts with all correct settings
            ↓
Health checks monitor the app
            ↓
Auto-restart if anything fails
            ↓
🎉 Backend is live with zero-config!
```

---

## ✅ ADVANTAGES OF USING CONFIG-AS-CODE

### Before (Manual Configuration):
```
1. Create project in Railway dashboard
2. Click "Settings"
3. Add PORT variable
4. Add NODE_ENV variable
5. Add MONGODB_URI variable
6. Add JWT_SECRET variable
7. Add FRONTEND_URL variable
8. Add ADMIN_REGISTRATION_KEY variable
9. Add CORS_ORIGIN variable
10. Set health check path
11. Configure restart policy
12. Save everything
```

**Time**: 10-15 minutes | **Error-prone**: Yes | **Reproducible**: No

### After (Config-as-Code):
```
1. Have railway.toml in your repo
2. Push code to GitHub
3. Railway automatically applies all settings
```

**Time**: 2 minutes | **Error-prone**: No | **Reproducible**: Yes

---

## 🔒 SECURITY BEST PRACTICES

### Keep Secrets Secure

The `railway.toml` file contains sensitive values. Follow these practices:

1. **Never commit secrets to public repos**
   - Use Railway's secret management for sensitive values
   - Or add `railway.toml` to `.gitignore` after setup

2. **Use Railway's Secret Management**
   - Instead of plaintext in file:
   ```toml
   # Bad (visible in repo):
   JWT_SECRET = "your-actual-secret"

   # Good (reference Railway secret):
   JWT_SECRET = "${RAILWAY_JWT_SECRET}"
   ```

3. **Keep File Secure**
   - Only share with team members who need it
   - Don't upload to public spaces
   - Version control only non-sensitive config

---

## 🚀 DEPLOYMENT WITH CONFIG-AS-CODE

### Step 1: Push Code with railway.toml

```bash
cd "D:\Utkarsh\Fusion_Cars"
git add .
git commit -m "Add Railway config-as-code"
git push origin main
```

### Step 2: Go to Railway Dashboard

Visit: https://railway.app/dashboard

### Step 3: Create/Import Project

- Click "New Project"
- Select "GitHub Repo"
- Choose `fusion-cars`
- Click "Import"

### Step 4: Enable Config-as-Code

1. Go to project settings
2. Find "Config as Code" section
3. Enable/toggle ON
4. Railway uses railway.toml

### Step 5: Deploy

- Railway automatically reads railway.toml
- All settings applied
- Application deployed
- Health checks enabled
- Auto-restart configured

### Step 6: Verify

- Check dashboard shows all variables
- Verify health check endpoint works
- Monitor logs for any issues

---

## 📋 CHECKLIST

Before deploying with config-as-code:

- [ ] `railway.toml` exists in `BE_FusionCars` root
- [ ] All variables have correct values
- [ ] `MONGODB_URI` updated to your connection string
- [ ] `FRONTEND_URL` set to your Vercel URL (after deployment)
- [ ] `CORS_ORIGIN` set to your Vercel URL
- [ ] JWT_SECRET kept secure
- [ ] ADMIN_REGISTRATION_KEY kept secure
- [ ] File pushed to GitHub
- [ ] Config-as-Code enabled in Railway
- [ ] Deployment completed successfully
- [ ] Health check working
- [ ] All API endpoints responding

---

## 🐛 TROUBLESHOOTING

### Issue: "railway.toml not recognized"

**Solution:**
1. Ensure file is in root of `BE_FusionCars` folder
2. File name must be exactly `railway.toml` (case-sensitive)
3. Push code to GitHub
4. Refresh Railway dashboard

### Issue: "Environment variables not set"

**Solution:**
1. Check `[variables]` section is correct
2. Verify all key-value pairs are present
3. Check for typos in variable names
4. Redeploy project

### Issue: "Build failing"

**Solution:**
1. Check `[build]` section configuration
2. Verify `cmd` in `[start]` section
3. Check port matches your app
4. Review Railway build logs

### Issue: "Health check failing"

**Solution:**
1. Verify `/api/health` endpoint exists in code
2. Check port is correct (5000)
3. Ensure `healthchecks.enabled = true`
4. Test endpoint manually: `curl http://localhost:5000/api/health`

---

## 📚 HELPFUL RESOURCES

- **Railway Docs**: https://docs.railway.app
- **Railway Config-as-Code**: https://docs.railway.app/guides/config-as-code
- **TOML Format Guide**: https://toml.io
- **Railway CLI Docs**: https://docs.railway.app/guides/cli

---

## 💡 PRO TIPS

### Tip 1: Version Your Configuration
```bash
# Tag your config versions
git tag -a v1.0-config -m "Initial Railway config"
git push origin v1.0-config
```

### Tip 2: Document Changes
```toml
# At top of railway.toml:
# Version: 1.0
# Updated: November 8, 2024
# Changes: Initial backend configuration
```

### Tip 3: Use Environment-Specific Files

```bash
# Create environment-specific files:
railroad.dev.toml    # Development
railway.prod.toml    # Production
railway.staging.toml # Staging

# Then deploy with:
railway up -f railway.prod.toml
```

### Tip 4: Monitor via Railway CLI

```bash
# Monitor logs:
railway logs

# Monitor deployments:
railway deployments

# Check variables:
railway variables
```

---

## 🎯 COMPLETE FLOW

```
1. Edit railway.toml with your values
   └─ Update MONGODB_URI
   └─ Update FRONTEND_URL
   └─ Update CORS_ORIGIN
   └─ Keep secrets secure

2. Push to GitHub
   └─ git add .
   └─ git commit -m "Railway config"
   └─ git push origin main

3. Enable in Railway
   └─ Go to Settings → Config as Code
   └─ Enable railway.toml

4. Deploy
   └─ Railway reads configuration
   └─ Applies all settings
   └─ Builds and deploys app

5. Verify
   └─ Check dashboard
   └─ Test health endpoint
   └─ Monitor logs

6. Monitor
   └─ Use Railway dashboard
   └─ Watch health checks
   └─ Check performance
```

---

## ✅ SUCCESS INDICATORS

When config-as-code is working:

✅ `railway.toml` detected by Railway
✅ All environment variables shown in dashboard
✅ Build completes successfully
✅ App starts without manual configuration
✅ Health check endpoint responding
✅ API endpoints accessible
✅ No configuration errors in logs
✅ Auto-restart working if crash occurs

---

## 📊 SUMMARY

| Aspect | Details |
|--------|---------|
| **File Name** | `railway.toml` |
| **Location** | Root of `BE_FusionCars` |
| **Format** | TOML |
| **Variables** | 7 required |
| **Sections** | build, deploy, start, variables |
| **Auto-Detection** | Yes (Railway auto-detects) |
| **Version Control** | Yes (commit to GitHub) |
| **Security** | Use secrets for sensitive values |
| **Deployment** | Automatic after push |

---

## 🚀 NEXT STEPS

1. **Update railway.toml** with your values:
   - `MONGODB_URI`
   - `FRONTEND_URL`
   - `CORS_ORIGIN`

2. **Push to GitHub**:
   ```bash
   git add BE_FusionCars/railway.toml
   git commit -m "Add Railway config-as-code"
   git push origin main
   ```

3. **Enable in Railway Dashboard**:
   - Go to Settings → Config as Code
   - Enable railway.toml

4. **Deploy**:
   - Click Deploy
   - Railway uses configuration from file
   - App is live!

---

**Status**: ✅ railway.toml ready for use
**Location**: `BE_FusionCars/railway.toml`
**Next**: Update values and deploy!

Your infrastructure-as-code is ready! 🚀
