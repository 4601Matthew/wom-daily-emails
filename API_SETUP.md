# Road Closure API Integration Setup

This document explains how to configure the road closure API integration feature.

## Overview

The application includes functionality to fetch road closures from external APIs:
- **NZTA** (New Zealand Transport Agency)
- **NPDC** (New Plymouth District Council)
- **South Taranaki District Council**
- **Stratford District Council**

## How It Works

1. Click the **"🌐 Import from APIs"** button in the Planned Road Closures modal
2. Select which API to fetch from (or "Fetch All" to get from all sources)
3. Review the fetched closures in the list
4. Click **"✓ Accept"** to add a closure to your planned closures, or **"✗ Reject"** to dismiss it

## Configuration

### Step 1: Find API Endpoints

You'll need to obtain the actual API endpoints from each organization:

1. **NZTA**: Contact NZTA or check their developer documentation
2. **NPDC**: Contact New Plymouth District Council IT department
3. **South Taranaki**: Contact South Taranaki District Council
4. **Stratford**: Contact Stratford District Council

### Step 2: Update the Pages Function

Edit `functions/api/fetch-closures.js` and update each fetch function with the actual API endpoints:

```javascript
async function fetchNZTA() {
  try {
    const response = await fetch('YOUR_NZTA_API_ENDPOINT_HERE');
    const data = await response.json();
    return parseNZTAClosures(data);
  } catch (error) {
    console.error('Error fetching NZTA closures:', error);
    return [];
  }
}
```

Repeat for `fetchNPDC()`, `fetchSouthTaranaki()`, and `fetchStratford()`.

### Step 3: Implement Parsing Functions

Each API will return data in a different format. You need to parse the response and convert it to the standard format:

```javascript
function parseNZTAClosures(data) {
  return data.map(item => ({
    startDate: item.start_date || item.startDate, // Convert to YYYY-MM-DD format
    endDate: item.end_date || item.endDate,       // Convert to YYYY-MM-DD format
    roadName: item.road_name || item.roadName || item.road,
    type: item.type || item.closure_type,
    closureInfo: item.description || item.info || item.closure_info,
    detour: item.detour || item.detour_info || ''
  }));
}
```

### Step 4: Handle Authentication (if required)

If any API requires authentication (API keys, tokens, etc.), add them to your Cloudflare environment variables:

1. Go to Cloudflare Dashboard → Pages → Your Project → Settings → Environment Variables
2. Add variables like `NZTA_API_KEY`, `NPDC_API_KEY`, etc.
3. Update the fetch function to include the key:

```javascript
async function fetchNZTA() {
  const apiKey = env.NZTA_API_KEY; // Access from env context
  const response = await fetch('YOUR_API_ENDPOINT', {
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      // or 'X-API-Key': apiKey
    }
  });
  // ... rest of function
}
```

## Data Format

The system expects closures in this format:

```javascript
{
  startDate: "2025-02-05",      // YYYY-MM-DD format
  endDate: "2025-02-10",        // YYYY-MM-DD format
  roadName: "State Highway 3", // Road name
  type: "Full Closure",          // Type of closure
  closureInfo: "Road closed for maintenance", // Description
  detour: "Use SH45 via New Plymouth"        // Detour information
}
```

## Testing

1. Deploy your changes to Cloudflare Pages
2. Open the Planned Road Closures modal
3. Click "🌐 Import from APIs"
4. Try fetching from each source
5. Verify the data appears correctly
6. Test accepting/rejecting closures

## Troubleshooting

### No closures appearing
- Check the browser console for errors
- Verify the API endpoints are correct
- Check if authentication is required
- Verify the parsing function matches the API response format

### CORS errors
- The Pages Function runs server-side, so CORS shouldn't be an issue
- If you see CORS errors, the API might be blocking Cloudflare IPs

### Authentication errors
- Verify API keys are set correctly in environment variables
- Check the authentication method (Bearer token, API key header, etc.)

## Notes

- The API endpoints are currently placeholders - you'll need to replace them with actual endpoints
- Some councils may not have public APIs and may require web scraping or manual data entry
- Consider implementing caching to avoid hitting API rate limits
- Add error handling for network failures and invalid responses

