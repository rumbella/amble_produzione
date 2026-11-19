// Netlify Function: risponde su /api/homepage usando la stessa logica di api/homepage.ts
import { POST } from '../../api/homepage';

export default (request: Request) =>
  request.method === 'POST'
    ? POST(request)
    : new Response(JSON.stringify({ error: 'Usa POST' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });

export const config = { path: '/api/homepage' };
