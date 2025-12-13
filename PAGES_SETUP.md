# Cloudflare Pages Functions Setup Guide

This guide explains how to set up shared data storage using Cloudflare Pages Functions with KV.

## ✅ What's Already Done

1. ✅ Pages Function created at `functions/api/data.js`
2. ✅ KV binding configured in Cloudflare Pages (you already did this!)
3. ✅ Code updated to automatically use the Pages Function API

## 📋 Setup Steps

### Step 1: Verify KV Binding in Cloudflare Pages

1. Go to your Cloudflare Pages project
2. Navigate to **Settings** → **Functions** → **Bindings**
3. Verify you have:
   - **Type**: `KV namespace`
   - **Name**: `DATA_STORE`
   - **Value**: Your KV namespace

If you already set this up (as shown in your screenshot), you're good! ✅

### Step 2: Deploy to Cloudflare Pages

1. Push your code to GitHub/GitLab (make sure `functions/api/data.js` is included)
2. In Cloudflare Dashboard → Pages → Your Project
3. The deployment will automatically:
   - Detect the `functions` directory
   - Deploy the Pages Function
   - Connect it to your KV binding

### Step 3: Test It!

1. Open your deployed Pages site
2. Add some data (callsigns, tasks, etc.)
3. Open the site in a different browser/device
4. The data should appear there too! 🎉

## 🔧 How It Works

- **Pages Function**: `functions/api/data.js` handles all API requests
- **KV Storage**: Your `DATA_STORE` binding stores all the data
- **Auto-detection**: The code automatically uses your Pages URL for the API
- **Fallback**: If API fails, it uses localStorage as backup

## 📁 File Structure

```
your-project/
├── index.html          # Main app
├── functions/
│   └── api/
│       └── data.js     # Pages Function (API endpoint)
└── ...other files
```

## 🚀 API Endpoints

- **GET** `/api/data` - Retrieve all data
- **POST** `/api/data` - Save all data

The API automatically handles CORS and works from any origin.

## 🐛 Troubleshooting

- **Data not saving?** Check browser console for errors
- **CORS errors?** The function includes CORS headers automatically
- **KV not working?** Verify the binding name matches exactly: `DATA_STORE`

## 📝 Notes

- You can remove `worker.js` and `wrangler.toml` - they're not needed for Pages Functions
- The API URL is automatically detected from your Pages domain
- All data is shared across all users who access your Pages site

