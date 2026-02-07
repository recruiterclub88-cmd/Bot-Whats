import { NextRequest, NextResponse } from 'next/server';

function isProtected(pathname: string): boolean {
  if (pathname.startsWith('/admin/dashboard')) return true;
  if (pathname.startsWith('/api/admin')) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isProtected(pathname)) return NextResponse.next();

  const user = process.env.WEB_ADMIN_LOGIN || '';
  const pass = process.env.WEB_ADMIN_PASSWORD || '';

  // Try to authenticate via Cookie (Preferred) OR Basic Auth (for backward compatibility if needed)
  const sessionCookie = req.cookies.get('admin_session')?.value;
  const authHeader = req.headers.get('authorization');

  let authorized = false;

  // 1. Check Cookie
  if (sessionCookie) {
    try {
      const decoded = atob(sessionCookie);
      const idx = decoded.indexOf(':');
      const u = decoded.slice(0, idx);
      const p = decoded.slice(idx + 1);
      if (u === user && p === pass) {
        authorized = true;
      }
    } catch (e) { }
  }

  // 2. Fallback to Basic Auth header (if not already authorized)
  if (!authorized && authHeader) {
    const [scheme, encoded] = authHeader.split(' ');
    if (scheme === 'Basic' && encoded) {
      try {
        const decoded = atob(encoded);
        const idx = decoded.indexOf(':');
        const u = decoded.slice(0, idx);
        const p = decoded.slice(idx + 1);
        if (u === user && p === pass) {
          authorized = true;
        }
      } catch (e) { }
    }
  }

  if (authorized) return NextResponse.next();

  // If not authorized:
  // For API requests: return 401 WITHOUT challenge header
  if (pathname.startsWith('/api/')) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // For page requests: redirect to login
  const url = req.nextUrl.clone();
  url.pathname = '/admin';
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
