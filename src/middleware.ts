import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

function isProtected(pathname: string): boolean {
  if (pathname.startsWith('/admin/dashboard')) return true;
  if (pathname.startsWith('/api/admin')) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isProtected(pathname)) return NextResponse.next();

  // Використовуємо нові імена для 100% скидання кешу
  const user = process.env.MY_ADMIN_USER || '';
  const pass = process.env.MY_ADMIN_PASS || '';

  const sessionCookie = req.cookies.get('admin_session')?.value;
  const authHeader = req.headers.get('authorization');

  let authorized = false;

  if (sessionCookie) {
    try {
      const decoded = atob(sessionCookie);
      const [u, p] = decoded.split(':');
      if (u === user && p === pass && user !== '') {
        authorized = true;
      }
    } catch (e) { }
  }

  if (!authorized && authHeader) {
    const [scheme, encoded] = authHeader.split(' ');
    if (scheme === 'Basic' && encoded) {
      try {
        const decoded = atob(encoded);
        const [u, p] = decoded.split(':');
        if (u === user && p === pass && user !== '') {
          authorized = true;
        }
      } catch (e) { }
    }
  }

  if (authorized) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return new NextResponse(JSON.stringify({ error: 'unauthorized_middleware' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const url = req.nextUrl.clone();
  url.pathname = '/admin';
  return NextResponse.redirect(url);
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] };
