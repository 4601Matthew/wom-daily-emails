// Cloudflare Worker to handle data storage/retrieval
export default {
  async fetch(request, env) {
    // Handle CORS
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // GET - Retrieve data
      if (request.method === 'GET') {
        if (path === '/api/data') {
          const data = await env.DATA_STORE.get('app_data', 'json');
          return new Response(JSON.stringify(data || {}), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        return new Response('Not Found', { status: 404, headers: corsHeaders });
      }

      // POST/PUT - Save data
      if (request.method === 'POST' || request.method === 'PUT') {
        if (path === '/api/data') {
          const data = await request.json();
          await env.DATA_STORE.put('app_data', JSON.stringify(data));
          return new Response(JSON.stringify({ success: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        return new Response('Not Found', { status: 404, headers: corsHeaders });
      }

      return new Response('Method Not Allowed', { status: 405, headers: corsHeaders });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  },
};

