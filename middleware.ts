import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Forward the real IP to our API
  const ip = request.ip ?? request.headers.get('x-real-ip');
  res.headers.set('x-real-ip', ip ?? 'unknown');

  // Verify authentication and admin status
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes that require authentication
  if (!session && (
    request.nextUrl.pathname.startsWith('/dashboard') ||
    request.nextUrl.pathname.startsWith('/admin')
  )) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Admin-only routes
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session?.user?.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/auth/:path*',
    '/:path*'
  ]
};