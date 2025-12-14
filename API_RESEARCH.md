# Road Closure API Research Results

## Summary

After extensive research, **none of these organizations appear to have public APIs** for road closure data. However, here are the findings and alternative approaches:

## Findings

### 1. NZTA (New Zealand Transport Agency / Waka Kotahi)
- **Status**: No public API found
- **Website**: https://www.nzta.govt.nz/
- **Road Closures Page**: https://www.nzta.govt.nz/traffic/current-conditions/
- **Contact**: Check their contact page for developer/API access inquiries
- **Alternative**: Web scraping their road closures page (check robots.txt first)

### 2. NPDC (New Plymouth District Council)
- **Status**: No public API found
- **Website**: https://www.npdc.govt.nz/
- **Contact**: info@npdc.govt.nz
- **Alternative**: Check their website for road closure listings or contact them for data access

### 3. South Taranaki District Council
- **Status**: No public API found
- **Website**: https://www.southtaranaki.com/
- **Road Closures Page**: https://www.southtaranaki.com/our-services/roading/road-closures
- **Contact**: info@southtaranaki.com
- **Alternative**: Web scraping or contact for data feed access

### 4. Stratford District Council
- **Status**: No public API found
- **Website**: Check their website for road closure information
- **Contact**: info@stratford.govt.nz
- **Alternative**: Contact them directly for data access

## Recommended Approach

Since public APIs don't exist, here are your options:

### Option 1: Contact the Organizations Directly
Reach out to each organization to:
- Ask if they have an API or data feed available
- Request developer access
- Ask about RSS feeds or data exports
- Inquire about partnership opportunities

### Option 2: Web Scraping
If the organizations don't have APIs, you could implement web scraping:
- **Pros**: Can get data directly from their websites
- **Cons**: 
  - May violate terms of service
  - Fragile (breaks if website structure changes)
  - Requires regular maintenance
  - May be blocked by robots.txt

**Important**: Always check robots.txt and terms of service before scraping!

### Option 3: Manual Entry
For now, the system supports manual entry of road closures, which is reliable and doesn't depend on external APIs.

### Option 4: Third-Party Aggregators
Check if there are any New Zealand traffic/road closure aggregator services that might have APIs.

## Implementation Status

The code structure is ready for API integration. Once you:
1. Get API endpoints from the organizations, OR
2. Implement web scraping, OR
3. Find alternative data sources

You can update the `functions/api/fetch-closures.js` file with the actual implementation.

## Next Steps

1. **Contact each organization** to inquire about API access
2. **Check their websites** for RSS feeds or data export options
3. **Consider web scraping** if APIs aren't available (with proper permissions)
4. **Use manual entry** in the meantime - the system already supports this well

## Example Contact Email Template

```
Subject: Road Closure Data API Access Request

Dear [Organization],

I am developing an application for emergency services in the Taranaki region 
that helps coordinate daily operations. I would like to integrate road closure 
data from [Organization Name] to help our teams stay informed about current 
road conditions.

Do you have:
- A public API for road closure data?
- An RSS feed or data export available?
- Developer access or partnership opportunities?
- Any other way to programmatically access road closure information?

Thank you for your time and consideration.

[Your Name]
[Your Organization]
[Contact Information]
```

