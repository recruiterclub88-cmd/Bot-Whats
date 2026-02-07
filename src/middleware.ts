import { NextRequest, NextResponse } from 'next/server';

function isProtected(pathname: string): boolean {
  if (pathname.startsWith('/admin/dashboard')) return true;
  if (pathname.startsWith('/api/admin')) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (!isProtected(pathname)) return NextResponse.next();

  const user = process.env.ADMIN_USER || '';
  const pass = process.env.ADMIN_PASS || '';

  const auth = req.headers.get('authorization');
  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      try {
        const decoded = Buffer.from(encoded, 'base64').toString('utf8');
        const idx = decoded.indexOf(':');
        const u = decoded.slice(0, idx);
        const p = decoded.slice(idx + 1);
        if (u === user && p === pass) return NextResponse.next();
      } catch (e) {
        // Invalid encoding
      }
    }
  }

  // If not authorized:
  // 1. For API requests: return 401 WITHOUT WWW-Authenticate to avoid browser popup
  if (pathname.startsWith('/api/')) {
    return new NextResponse('Authentication required', { status: 401 });
  }

  // 2. For page requests: redirect to the login page
  const url = req.nextUrl.clone();
  url.pathname = '/admin';
  return NextResponse.redirect(url);
}


export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
