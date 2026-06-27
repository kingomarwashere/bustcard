import { handleAPI } from './api.js';
import { landingPage } from './landing.js';
import { dashboardPage } from './dashboard.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (path.startsWith('/api/')) {
        return handleAPI(request, env, corsHeaders);
      }

      if (path === '/dashboard' || path === '/dashboard/') {
        return new Response(dashboardPage(), {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      }

      // All other routes → landing page
      return new Response(landingPage(), {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }
  },
};
