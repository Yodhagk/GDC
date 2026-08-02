import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const { pathname } = req.nextUrl;

    // Deactivated accounts lose access immediately, even with a still-valid session
    if (token && token.isActive === false) {
      const url = new URL('/portal/login', req.url);
      url.searchParams.set('error', 'AccountDeactivated');
      return NextResponse.redirect(url);
    }

    // Admin-only routes
    if (pathname.startsWith('/admin') && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/portal', req.url));
    }

    // IT support + admin routes
    if (
      pathname.startsWith('/it-support') &&
      !['admin', 'it_support'].includes(token?.role as string)
    ) {
      return NextResponse.redirect(new URL('/portal', req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;
        const publicPortalPages = [
          '/portal/login',
          '/portal/register',
          '/portal/forgot-password',
          '/portal/reset-password',
          '/portal/verify-email',
        ];
        if (publicPortalPages.includes(pathname)) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ['/portal/:path*', '/admin/:path*', '/it-support/:path*'],
};
