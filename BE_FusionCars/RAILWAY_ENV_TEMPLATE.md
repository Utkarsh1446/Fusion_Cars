# 🔧 Railway Environment Variables Setup

## Required Variables for Production Deployment

Copy and fill in these variables in Railway Dashboard:

---

## MongoDB Configuration

```
MONGODB_URI=mongodb+srv://chitranshnishad27_db_user:YOUR_NEW_PASSWORD@cluster0.2uxmdzm.mongodb.net/?retryWrites=true&w=majority
```

**Steps to get this:**
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Login → Databases → Click your cluster
3. Click **Connect** → **Drivers** → **Node.js**
4. Copy the connection string
5. Replace `YOUR_NEW_PASSWORD` with your NEW MongoDB password

**⚠️ SECURITY:** Change your MongoDB password BEFORE using this!

---

## JWT Configuration

```
JWT_SECRET=<PASTE_YOUR_GENERATED_SECRET_HERE>
```

**How to generate:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

Run this in your terminal and copy the output.

**Example output:**
```
a3f8c9d2e1b4f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8w9x0y1z2a3b4c5d6e7f8g9h0i1j2k3l4m5n6o7p8q9r0
```

**Keep this secret!** Anyone with this can forge JWT tokens.

---

## Admin Configuration

```
ADMIN_REGISTRATION_KEY=fusion_admin_2024_secret_xyz789
```

**Choose any random string** that only you know. Examples:
- `my_super_secret_admin_key_12345`
- `fusion_cars_admin_protect_2024`
- `admin_key_abc123def456ghi789`

**Keep this secret!** It's used to create the first admin user.

---

## Application Configuration

```
NODE_ENV=production
```

**Why:** Tells the app to run in production mode (optimized, no debug logs).

---

## Port Configuration

```
PORT=5000
```

**Why:** Node.js server listens on port 5000. Railway forwards requests to this port.

---

## CORS Configuration

For local development + Vercel:
```
CORS_ORIGIN=http://localhost:3000,https://your-vercel-app.vercel.app
```

**After getting your Vercel URL, update this:**
1. Go to Railway Variables
2. Click on `CORS_ORIGIN`
3. Update the value
4. Redeploy

**Format:**
- Multiple origins: `http://localhost:3000,https://your-app.vercel.app` (comma-separated, no spaces)
- Single origin: `https://your-app.vercel.app`
- All origins (NOT recommended): `*`

---

## Optional Email Configuration

If you want to enable email notifications:

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@fusioncars.in
```

**Steps to enable:**
1. Use Gmail SMTP
2. Enable 2-factor authentication on your Google account
3. Generate an [App Password](https://myaccount.google.com/apppasswords)
4. Use that as `EMAIL_PASSWORD` (NOT your main password)

---

## Optional AWS S3 Configuration

If you want to use AWS S3 for image uploads:

```
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=fusion-cars-bucket
```

Leave these blank if using Cloudinary instead.

---

## Optional Cloudinary Configuration

If you want to use Cloudinary for image uploads:

```
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Get these from [Cloudinary Dashboard](https://cloudinary.com/console).

---

## How to Add to Railway

### Step 1: Go to Railway Dashboard
1. Open [railway.app](https://railway.app)
2. Click on your **Fusion Cars** project
3. Select the **Backend** service

### Step 2: Go to Variables Tab
1. Click **Variables** (usually in the top navigation)
2. Or go **Settings** → **Variables**

### Step 3: Add Each Variable
1. Click **New Variable** (or the + button)
2. Enter the **Name** (e.g., `MONGODB_URI`)
3. Enter the **Value** (your actual value, NOT a placeholder)
4. Press **Enter** or click **Add**
5. Repeat for each variable

### Step 4: Redeploy
After adding all variables:
1. Click **Deploy** button, OR
2. Go back to main view and click **Deploy**, OR
3. Push a new commit to GitHub (auto-triggers deploy)

---

## Verification Checklist

After adding variables, verify:

- [ ] `MONGODB_URI` is set and correct
- [ ] `JWT_SECRET` is a random string (64+ characters)
- [ ] `ADMIN_REGISTRATION_KEY` is set
- [ ] `NODE_ENV` is `production`
- [ ] `PORT` is `5000`
- [ ] `CORS_ORIGIN` includes your frontend URL
- [ ] All values use actual data, NOT placeholders
- [ ] No extra spaces in values
- [ ] No quotes around values (Railway handles them)

---

## Testing After Deployment

Once deployed, test with:

```bash
# Replace YOUR_RAILWAY_URL with your actual URL
curl https://YOUR_RAILWAY_URL/api/health

# Expected response:
# {"status":"Server is running","database":"Connected","timestamp":"..."}
```

If you get errors, check:
1. Health endpoint shows the variable issue in logs
2. Go to Railway **Logs** tab to see error messages
3. Common issues:
   - Wrong MongoDB password
   - Missing `MONGODB_URI` variable
   - MongoDB IP whitelist doesn't include Railway

---

## Security Notes

✅ **DO:**
- Change MongoDB password before deploying
- Generate new JWT secret for production
- Keep all secrets safe and unique
- Use Railway's built-in variable encryption
- Rotate secrets periodically

❌ **DON'T:**
- Commit `.env` files to GitHub (already in `.gitignore`)
- Hardcode secrets in source code
- Share your JWT secret or admin key
- Use the same secret across projects
- Leave MongoDB IP whitelist as `0.0.0.0/0` for sensitive data (but it's fine for this project)

---

## Summary Table

| Variable | Required | Example | Notes |
|----------|----------|---------|-------|
| MONGODB_URI | ✅ Yes | `mongodb+srv://user:pass@cluster...` | Change password first! |
| JWT_SECRET | ✅ Yes | Random 64 char string | Keep secret |
| ADMIN_REGISTRATION_KEY | ✅ Yes | `fusion_admin_2024_xyz` | Keep secret |
| NODE_ENV | ✅ Yes | `production` | Must be production |
| PORT | ✅ Yes | `5000` | Don't change |
| CORS_ORIGIN | ✅ Yes | `https://your-app.vercel.app` | Add your frontend |
| EMAIL_HOST | ❌ No | `smtp.gmail.com` | Optional |
| AWS/Cloudinary | ❌ No | Your keys | Optional |

---

## Next Steps

1. **Fill in your actual values** (not examples)
2. **Add to Railway Variables** (one by one)
3. **Redeploy** the backend
4. **Test health endpoint** to verify
5. **Create admin user** using the API
6. **Deploy frontend** with backend URL
7. **Test the full app**

**Questions?** Check the main `RAILWAY_DEPLOYMENT_GUIDE.md` file!

---

**Ready to deploy?** Start with the variables above! 🚀
