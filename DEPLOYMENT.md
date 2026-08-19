# TAXELEA Deployment Guide

This guide will help you deploy TAXELEA using free hosting services.

## Prerequisites

- Git installed and configured
- GitHub account (for Vercel/Netlify deployment)
- Node.js and npm installed locally

## Deployment Options

### Option 1: Vercel (Recommended)

Vercel provides excellent free hosting for React applications with automatic deployments.

#### Steps:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up/login with GitHub
   - Click "Add New Project"
   - Import your TAXELEA repository
   - Vercel will automatically detect the build settings from `vercel.json`
   - Click "Deploy"

3. **Your app will be live at**: `https://your-project.vercel.app`

#### Vercel Features:
- ✅ Free SSL certificates
- ✅ Automatic deployments on git push
- ✅ Global CDN
- ✅ Preview deployments
- ✅ Custom domains (free)

### Option 2: Netlify

Netlify is another excellent free hosting option with great features.

#### Steps:

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up/login with GitHub
   - Click "Add new site" → "Import an existing project"
   - Select your TAXELEA repository
   - Netlify will detect the build settings from `netlify.toml`
   - Click "Deploy site"

3. **Your app will be live at**: `https://your-project.netlify.app`

#### Netlify Features:
- ✅ Free SSL certificates
- ✅ Automatic deployments on git push
- ✅ Form handling
- ✅ Serverless functions
- ✅ Custom domains (free)

### Option 3: GitHub Pages

Free hosting directly from GitHub.

#### Steps:

1. **Update vite.config.js**
   ```javascript
   base: '/your-repo-name', // Add this to config
   ```

2. **Build and Deploy**
   ```bash
   npm run build
   # Deploy dist folder to gh-pages branch
   ```

3. **Enable GitHub Pages**
   - Go to repository Settings → Pages
   - Select gh-pages branch
   - Your app will be live at `https://username.github.io/repo-name`

## Manual Deployment (Alternative)

If you prefer manual deployment:

### Build for Production
```bash
npm run build
```

### Deploy the `dist` folder to any static hosting:
- Firebase Hosting
- AWS S3 + CloudFront
- DigitalOcean App Platform
- Any web server

## Build Optimization

The project is already optimized for production:
- Code splitting (vendor, UI chunks)
- Tree shaking
- Asset optimization
- Gzip compression ready

## Environment Variables

The app uses localStorage for data persistence, so no environment variables are needed for basic functionality.

## Post-Deployment Checklist

- [ ] Test authentication flow
- [ ] Verify leaderboard functionality
- [ ] Check test taking features
- [ ] Test on mobile devices
- [ ] Verify all routes work correctly
- [ ] Check performance metrics

## Custom Domain Setup

### Vercel:
1. Go to project settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Netlify:
1. Go to Domain settings
2. Add custom domain
3. Update DNS records as instructed

## Troubleshooting

### Build Issues
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Deployment Issues
- Check build logs in Vercel/Netlify dashboard
- Ensure all files are committed to git
- Verify build command is `npm run build`
- Check that publish directory is `dist`

### Routing Issues
- Both Vercel and Netlify are configured for SPA routing
- All routes redirect to index.html
- Test refresh on different pages

## Performance Monitoring

### Vercel Analytics
- Enable in project settings
- Free tier available

### Netlify Analytics
- Available in paid plans
- Consider Google Analytics (free)

## Scaling Considerations

Current architecture:
- Client-side only (no backend)
- localStorage for data persistence
- Suitable for single-user or small group usage

For production scaling:
- Add backend API
- Use database instead of localStorage
- Implement proper authentication
- Add rate limiting
- Consider CDN for static assets

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Netlify: [netlify.com/docs](https://netlify.com/docs)
- GitHub: [docs.github.com/pages](https://docs.github.com/pages)

## Cost

All mentioned options are **completely free** for:
- Personal projects
- Small applications
- Moderate traffic

## Next Steps

1. Choose your preferred platform (Vercel recommended)
2. Push code to GitHub
3. Deploy using the platform's dashboard
4. Test your deployed application
5. Share with users!