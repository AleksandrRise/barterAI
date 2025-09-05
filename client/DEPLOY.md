# Deployment Guide

## Vercel Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for production"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Connect your GitHub repository
   - Vercel will auto-detect this as a Vite React app

3. **Environment Variables**
   Add these in Vercel dashboard under Settings > Environment Variables:
   ```
   VITE_GOOGLE_MAPS_API_KEY = your_actual_google_maps_key
   VITE_OPENAI_API_KEY = your_actual_openai_key
   ```

4. **Deploy**
   - Vercel will automatically build and deploy
   - Your app will be available at `https://your-app-name.vercel.app`

## Other Platforms

### Netlify
- Drag and drop the `dist` folder after running `npm run build`
- Or connect via GitHub for auto-deployment

### Traditional Hosting
- Run `npm run build`
- Upload contents of `dist` folder to your web server

## Post-Deployment

1. Test all features with real API keys
2. Verify Google Maps functionality
3. Test OpenAI image analysis
4. Check responsive design on mobile devices