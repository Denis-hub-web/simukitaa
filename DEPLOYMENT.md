# Deployment Guide

This guide explains how to deploy the Simukitaa Store application to make it publicly accessible.

## Architecture

The application consists of two parts:
1. **Frontend** (React/Vite) - Can be hosted on Vercel, Netlify, or GitHub Pages
2. **Backend** (Node.js/Express) - Needs Node.js hosting like Render, Railway, or Fly.io

## Important Considerations

### Current Limitations
- **JSON File Database**: The current setup uses a local JSON file (`server/data/products.json`) which:
  - ❌ Won't persist on serverless platforms (Vercel, Netlify)
  - ❌ Won't work with multiple server instances
  - ❌ Can cause data loss on server restarts (depending on platform)
  
### Recommended for Production
For a production deployment, consider migrating to:
- **MongoDB Atlas** (free tier available)
- **Supabase** (PostgreSQL, free tier)
- **Firebase Firestore** (free tier)
- **PlanetScale** (MySQL, free tier)

---

## Option 1: Deploy with Render (Recommended for Free Hosting)

### Frontend Deployment (Vercel)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/simukitaa-store.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to https://vercel.com
   - Sign up/login with GitHub
   - Click "New Project"
   - Import your repository
   - The included `vercel.json` already sets:
     - **Build Command**: `npm install && npm run build`
     - **Output Directory**: `dist`
     - A rewrite for `/xyz-portal` → `/xyz-portal.html`
   - After connecting the repo, open **Settings → Environment Variables** and set:
     - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`
   - Click **Deploy**

### Backend Deployment (Render)

1. **Create a Render Account**: https://render.com (free tier available)

2. **Create a New Web Service**:
   - The repo now ships with a `render.yaml` blueprint.
   - Option A (GUI):
     - Click "New +" → "Web Service"
     - Connect your GitHub repository
     - Select the `server` directory when prompted
     - Build Command: `npm install`
     - Start Command: `node index.js`
   - Option B (Blueprint Deploy):
     - Install the [Render CLI](https://render.com/docs/infrastructure-as-code)
     - Run `render blueprint launch render.yaml`
     - Follow the prompts to set service name and region

3. **Persistent Storage**:
   - `render.yaml` provisions a 1GB disk mounted at `/opt/render/project/src/server/data`
   - This keeps `products.json` and backups safe across restarts

4. **Environment Variables**:
   - Set `INSTAGRAM_ACCESS_TOKEN` (required for the Instagram feed)
   - Optional:
     - `PORT` (Render auto-injects one, but you can override)
     - `NODE_ENV=production`
   - Use `server/env.example` as a reference

5. **Important**: 
   - Render free tier spins down after 15 minutes of inactivity
   - First request may take 30-60 seconds (cold start)
   - Disk persists, but free tier bandwidth/CPU are limited

### Update Frontend API URL

After deploying backend, update the frontend environment variable:
1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Update `VITE_API_BASE_URL` to your Render backend URL

---

## Option 2: Deploy with Railway (Alternative)

### Frontend: Same as above (Vercel)

### Backend: Railway

1. **Create Railway Account**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Configure**:
   - Root Directory: `server`
   - Start Command: `npm start`
   - Environment: `NODE_ENV=production`
4. **Deploy** and get your backend URL
5. **Update frontend** with the Railway backend URL

---

## Option 3: Full GitHub Pages (Frontend Only, Static)

For a static frontend only (no admin functionality):

1. Update `vite.config.js`:
   ```js
   base: '/your-repo-name/'
   ```

2. Build and deploy:
   ```bash
   npm run build
   ```

3. Use GitHub Pages Actions or deploy manually

**Note**: This won't work for the admin panel as it requires the backend API.

---

## Environment Variables

### Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend-url.onrender.com/api
```

### Backend (Set in Render/Railway dashboard)
```env
PORT=3001
NODE_ENV=production
```

---

## Post-Deployment Checklist

- [ ] Backend is running and accessible
- [ ] Frontend API URL points to backend
- [ ] Test admin panel at `/xyz-portal.html`
- [ ] Test product browsing on main page
- [ ] Test creating/editing products in admin
- [ ] Verify data persists after server restart
- [ ] Test WhatsApp links work correctly

---

## Troubleshooting

### Backend Not Responding
- Check Render/Railway logs
- Verify environment variables
- Ensure `PORT` is set correctly (Render uses `process.env.PORT`)

### Frontend Can't Connect to Backend
- Verify `VITE_API_BASE_URL` is correct
- Check CORS settings in backend (should allow your frontend domain)
- Check browser console for CORS errors

### Data Not Persisting
- File system on free tiers may have limitations
- Consider migrating to a database (MongoDB Atlas, Supabase)

---

## Security Recommendations

1. **Admin Panel**: Currently uses client-side password (not secure for production)
   - Consider implementing proper authentication (JWT tokens)
   - Add rate limiting
   - Use HTTPS only

2. **API Security**:
   - Add API authentication tokens
   - Implement rate limiting
   - Validate all inputs

3. **CORS**: Update CORS settings to only allow your frontend domain in production

---

## Next Steps (Production Ready)

1. **Migrate to Database**: Replace JSON file with MongoDB Atlas or Supabase
2. **Add Authentication**: Implement proper user authentication for admin
3. **Add HTTPS**: Both frontend and backend should use HTTPS
4. **Add Monitoring**: Set up error tracking (Sentry, LogRocket)
5. **Add CI/CD**: Automate deployments with GitHub Actions



