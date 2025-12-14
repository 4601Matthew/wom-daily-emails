// Cloudflare Pages Function to fetch road closures from external APIs
export async function onRequest(context) {
  const { request, env } = context;
  
  // Handle CORS
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight
  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const source = url.searchParams.get('source');
    
    if (!source) {
      return new Response(JSON.stringify({ error: 'Source parameter required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let closures = [];
    
    // Fetch from different sources
    switch (source) {
      case 'nzta':
        closures = await fetchNZTA();
        break;
      case 'npdc':
        closures = await fetchNPDC();
        break;
      case 'southtaranaki':
        closures = await fetchSouthTaranaki();
        break;
      case 'stratford':
        closures = await fetchStratford();
        break;
      default:
        return new Response(JSON.stringify({ error: 'Unknown source' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }

    return new Response(JSON.stringify({ closures }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}

// Fetch from NZTA using TrafficNZ.info API - Taranaki Region Specific
// API Documentation: https://trafficnz.info/service/traffic/rest/4?_wadl
// Official docs: https://www.nzta.govt.nz/traffic-and-travel-information/use-our-data/about-the-apis/
// This API provides road event data for New Zealand
// Available endpoints:
// - /events/roadevent/all - All road events
// - /events/roadevent/byregion/{region} - Events by region (e.g., "Taranaki")
// - /events/roadevent/withinbounds/{minlon}/{minlat}/{maxlon}/{maxlat} - Events within bounds
async function fetchNZTA() {
  try {
    // Fetch Taranaki-specific road events from TrafficNZ API
    // Using the byregion endpoint to get only Taranaki events
    const response = await fetch('https://trafficnz.info/service/traffic/rest/4/events/roadevent/byregion/Taranaki', {
      headers: {
        'Accept': 'application/json, application/xml, */*'
      }
    });
    
    if (!response.ok) {
      // If region-specific fails, try all events and filter by region
      console.log('Region-specific endpoint failed, trying all events...');
      return await fetchNZTAAll();
    }
    
    const contentType = response.headers.get('content-type') || '';
    let events = [];
    
    if (contentType.includes('application/json')) {
      events = await response.json();
    } else {
      // XML response - parse it
      const xmlText = await response.text();
      events = await parseXMLResponse(xmlText);
    }
    
    return parseNZTAClosures(events);
  } catch (error) {
    console.error('Error fetching NZTA closures:', error);
    // Fallback to fetching all and filtering
    return await fetchNZTAAll();
  }
}

// Fallback function to fetch all events and filter by Taranaki region
async function fetchNZTAAll() {
  try {
    const response = await fetch('https://trafficnz.info/service/traffic/rest/4/events/roadevent/all', {
      headers: {
        'Accept': 'application/json, application/xml, */*'
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const contentType = response.headers.get('content-type') || '';
    let events = [];
    
    if (contentType.includes('application/json')) {
      events = await response.json();
    } else {
      const xmlText = await response.text();
      events = await parseXMLResponse(xmlText);
    }
    
    // Filter for Taranaki region events
    const taranakiEvents = events.filter(event => {
      const region = (event.region || event.regionName || '').toLowerCase();
      return region.includes('taranaki');
    });
    
    return parseNZTAClosures(taranakiEvents);
  } catch (error) {
    console.error('Error fetching all NZTA closures:', error);
    return [];
  }
}

// Helper function to parse XML response from TrafficNZ API
async function parseXMLResponse(xmlText) {
  // Simple XML parsing for road events
  // This is a basic parser - you may want to use a proper XML library
  const events = [];
  
  // Look for roadevent elements
  const roadeventRegex = /<roadevent[^>]*>([\s\S]*?)<\/roadevent>/gi;
  let match;
  
  while ((match = roadeventRegex.exec(xmlText)) !== null) {
    const eventXml = match[1];
    const event = {};
    
    // Extract common fields
    const fields = ['id', 'type', 'description', 'startDate', 'endDate', 'roadName', 'name', 'region'];
    fields.forEach(field => {
      const regex = new RegExp(`<${field}[^>]*>([\\s\\S]*?)<\\/${field}>`, 'i');
      const fieldMatch = eventXml.match(regex);
      if (fieldMatch) {
        event[field] = fieldMatch[1].trim();
      }
    });
    
    if (Object.keys(event).length > 0) {
      events.push(event);
    }
  }
  
  return events;
}

// Fetch from NPDC (New Plymouth District Council)
// Check their website: https://www.npdc.govt.nz/
// Road closures are typically listed on their website
async function fetchNPDC() {
  try {
    // Option 1: Check if they have an API or data feed
    // Contact: info@npdc.govt.nz or check their website for developer resources
    
    // Option 2: Web scraping (check their road closures page)
    // const response = await fetch('https://www.npdc.govt.nz/your-council/road-closures/');
    // const html = await response.text();
    // return parseNPDCPage(html);
    
    // For now, return empty - implement based on what's available
    return [];
  } catch (error) {
    console.error('Error fetching NPDC closures:', error);
    return [];
  }
}

// Fetch from South Taranaki District Council
// Check their website: https://www.southtaranaki.com/
// Road closures page: https://www.southtaranaki.com/our-services/roading/road-closures
async function fetchSouthTaranaki() {
  try {
    // Option 1: Check for RSS feed or data export
    // They may have an RSS feed or JSON export on their road closures page
    
    // Option 2: Web scraping
    // const response = await fetch('https://www.southtaranaki.com/our-services/roading/road-closures');
    // const html = await response.text();
    // return parseSouthTaranakiPage(html);
    
    // Contact them: info@southtaranaki.com to ask about API access
    
    return [];
  } catch (error) {
    console.error('Error fetching South Taranaki closures:', error);
    return [];
  }
}

// Fetch from Stratford District Council
// Check their website for road closure information
// Contact: info@stratford.govt.nz
async function fetchStratford() {
  try {
    // Option 1: Check for API or data feed
    // Contact them to ask about developer access or data feeds
    
    // Option 2: Web scraping
    // Check their website for road closure pages
    // const response = await fetch('https://www.stratford.govt.nz/road-closures');
    // const html = await response.text();
    // return parseStratfordPage(html);
    
    return [];
  } catch (error) {
    console.error('Error fetching Stratford closures:', error);
    return [];
  }
}

// Helper function to parse and normalize closure data
// Each API will return data in different formats, so we normalize to our format:
// {
//   startDate: "YYYY-MM-DD",
//   endDate: "YYYY-MM-DD",
//   roadName: "Road Name",
//   type: "Closure Type",
//   closureInfo: "Description",
//   detour: "Detour information"
// }

function parseNZTAClosures(data) {
  // Parse TrafficNZ.info API response
  // The API returns road events which may include closures, incidents, etc.
  // Format: Array of road event objects or XML structure
  
  if (!data) {
    return [];
  }
  
  // Handle different response formats
  let events = [];
  
  if (Array.isArray(data)) {
    events = data;
  } else if (data.response && Array.isArray(data.response.roadevent)) {
    events = data.response.roadevent;
  } else if (data.response && !Array.isArray(data.response.roadevent) && data.response.roadevent) {
    events = [data.response.roadevent];
  } else if (data.roadevent && Array.isArray(data.roadevent)) {
    events = data.roadevent;
  } else if (data.roadevent && !Array.isArray(data.roadevent)) {
    events = [data.roadevent];
  } else {
    return [];
  }
  
  return events
    .filter(event => {
      // Filter for actual closures - check event type/description
      if (!event) return false;
      
      const type = (event.type || event.eventType || '').toLowerCase();
      const desc = (event.description || event.desc || event.message || '').toLowerCase();
      const name = (event.name || event.roadName || '').toLowerCase();
      
      return type.includes('closure') || 
             type.includes('closed') || 
             desc.includes('closure') || 
             desc.includes('closed') ||
             name.includes('closure');
    })
    .map(event => {
      // Map to our standard format
      const startDate = event.startDate || event.start || event.startTime || '';
      const endDate = event.endDate || event.end || event.endTime || '';
      
      // Try to parse dates if they're in different formats
      let formattedStartDate = '';
      let formattedEndDate = '';
      
      if (startDate) {
        try {
          const start = new Date(startDate);
          if (!isNaN(start.getTime())) {
            formattedStartDate = start.toISOString().split('T')[0];
          } else {
            formattedStartDate = startDate;
          }
        } catch (e) {
          formattedStartDate = startDate;
        }
      }
      
      if (endDate) {
        try {
          const end = new Date(endDate);
          if (!isNaN(end.getTime())) {
            formattedEndDate = end.toISOString().split('T')[0];
          } else {
            formattedEndDate = endDate;
          }
        } catch (e) {
          formattedEndDate = endDate;
        }
      }
      
      return {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        roadName: event.roadName || event.road || event.name || event.description || 'Unknown Road',
        type: event.type || event.eventType || 'Road Closure',
        closureInfo: event.description || event.desc || event.message || '',
        detour: event.detour || event.alternativeRoute || event.alternative || ''
      };
    });
}

function parseNPDCClosures(data) {
  // TODO: Implement parsing logic for NPDC API response
  return [];
}

function parseSouthTaranakiClosures(data) {
  // TODO: Implement parsing logic for South Taranaki API response
  return [];
}

function parseStratfordClosures(data) {
  // TODO: Implement parsing logic for Stratford API response
  return [];
}

