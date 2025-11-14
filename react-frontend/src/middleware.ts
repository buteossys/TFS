import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define allowed origins - add your production domain when ready
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  // Add your production domain here
  // 'https://your-production-domain.com'
];

export function middleware(request: NextRequest) {
  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // Handle CORS for API routes
  if (path.startsWith('/api/')) {
    const origin = request.headers.get('origin');
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      const response = new NextResponse(null, { status: 204 });
      
      if (isAllowedOrigin) {
        response.headers.set('Access-Control-Allow-Origin', origin);
        response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours
        response.headers.set('Access-Control-Allow-Credentials', 'true');
      }
      
      return response;
    }

    // Handle actual requests
    const response = NextResponse.next();

    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 