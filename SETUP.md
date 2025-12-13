# Cloudflare Workers + KV Setup Guide

This guide will help you set up shared data storage using Cloudflare Workers and KV.

## Step 1: Install Wrangler CLI

```bash
npm install -g wrangler
```

Or if you prefer using npx:
```bash
npx wrangler login
```

## Step 2: Login to Cloudflare

```bash
wrangler login
```

This will open your browser to authenticate with Cloudflare.

## Step 3: Create a KV Namespace

```bash
wrangler kv:namespace create "DATA_STORE"
```

This will output something like:
```
🌀  Creating namespace with title "wom-daily-emails-api-DATA_STORE"
✨  Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "DATA_STORE", id = "abc123def456..." }
```

## Step 4: Create Preview KV Namespace (for development)

```bash
wrangler kv:namespace create "DATA_STORE" --preview
```

This will output another ID. Add both IDs to `wrangler.toml`.

## Step 5: Update wrangler.toml

Edit `wrangler.toml` and replace the placeholder IDs with your actual KV namespace IDs:

```toml
[[kv_namespaces]]
binding = "DATA_STORE"
id = "your-actual-kv-namespace-id"
preview_id = "your-actual-preview-kv-namespace-id"
```

## Step 6: Deploy the Worker

```bash
wrangler deploy
```

After deployment, you'll get a URL like:
```
https://wom-daily-emails-api.your-account.workers.dev
```

## Step 7: Update index.html

In `index.html`, find this line near the top of the script section:

```javascript
const API_BASE_URL = ""; // Leave empty to use localStorage only
```

Replace it with your Worker URL:

```javascript
const API_BASE_URL = "https://wom-daily-emails-api.your-account.workers.dev";
```

## Step 8: Deploy to Cloudflare Pages

1. Push your code to GitHub/GitLab
2. In Cloudflare Dashboard → Pages → Create a project
3. Connect your repository
4. Build settings:
   - Framework preset: None
   - Build command: (leave empty)
   - Build output directory: `/`
   - Root directory: `/`

## How It Works

- **With API_BASE_URL set**: Data is saved to Cloudflare KV and shared across all users
- **Without API_BASE_URL**: Falls back to localStorage (browser-specific, not shared)

The app automatically:
- Loads data from the API on startup
- Saves to both API and localStorage (localStorage as backup)
- Falls back to localStorage if API is unavailable

## Testing

1. Open the app in one browser
2. Add some data (callsigns, tasks, etc.)
3. Open the app in a different browser/device
4. The data should appear there too!

## Troubleshooting

- Check Worker logs in Cloudflare Dashboard
- Verify KV namespace IDs in wrangler.toml
- Check browser console for API errors
- Ensure CORS is working (the Worker includes CORS headers)

