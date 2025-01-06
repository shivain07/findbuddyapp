import { NextRequest, NextResponse } from 'next/server';

const allowedOrigins = process.env.MOBILE_API_URLS!.split(',');

const corsOptions = {
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Credentials': 'true',
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  // Handle CORS first
  const corsResponse = corsHandlingMWare(request);
  if (corsResponse) {
    return corsResponse; // Return the CORS response if applicable
  }

  // Default response if no middleware takes action
  return NextResponse.next();

}

const corsHandlingMWare = (request: NextRequest) => {

  const path = request.nextUrl.pathname;
  const origin = request.headers.get('origin') ?? '';
  const isAllowedOrigin = allowedOrigins.includes(origin);

  // Separate API and frontend routes
  const isApiRoute = path.startsWith('/api/');

  // Handle API CORS logic
  if (isApiRoute) {
    const isPreflight = request.method === 'OPTIONS';

    if (isPreflight) {
      const preflightHeaders = {
        ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
        ...corsOptions,
      };
      return NextResponse.json({}, { headers: preflightHeaders });
    }

    const response = NextResponse.next();
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
    }
    Object.entries(corsOptions).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }
}

// Config matcher
export const config = {
  matcher: [
    '/api/:path*', // API routes
    '/',           // Root
    '/login',      // Public login route
    '/signup',     // Public signup route
    '/home',       // Protected route
    '/profile/:path*', // Protected profile routes
  ],
};
