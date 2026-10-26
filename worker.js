import { onRequestGet as getBookings, onRequestPost as postBookings, onRequestPatch as patchBookings } from './functions/api/bookings.js';
import { onRequestGet as getBranches } from './functions/api/branches.js';
import { onRequestGet as getDishes, onRequestPost as postDishes } from './functions/api/dishes.js';
import { onRequestGet as getEvents, onRequestPost as postEvents, onRequestPatch as patchEvents, onRequestDelete as deleteEvents } from './functions/api/events.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // API Routes
    if (url.pathname === '/api/branches' || url.pathname === '/api/branches/') {
      if (request.method === 'GET') return getBranches({ env });
    }

    if (url.pathname === '/api/bookings' || url.pathname === '/api/bookings/') {
      if (request.method === 'GET') return getBookings({ env });
      if (request.method === 'POST') return postBookings({ request, env });
      if (request.method === 'PATCH') return patchBookings({ request, env });
    }

    if (url.pathname === '/api/dishes' || url.pathname === '/api/dishes/') {
      if (request.method === 'GET') return getDishes({ env });
      if (request.method === 'POST') return postDishes({ request, env });
    }

    if (url.pathname === '/api/events' || url.pathname === '/api/events/') {
      if (request.method === 'GET') return getEvents({ env });
      if (request.method === 'POST') return postEvents({ request, env });
      if (request.method === 'PATCH') return patchEvents({ request, env });
      if (request.method === 'DELETE') return deleteEvents({ request, env });
    }

    // Fallback to static assets
    if (env.ASSETS) {
      return env.ASSETS.fetch(request);
    }

    return new Response('Not found', { status: 404 });
  }
};
