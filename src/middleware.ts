import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Skip middleware for login page to prevent redirect loop
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    // Admin routes protection
    if (pathname.startsWith('/admin')) {
      if (!token) {
        // Redirect to login if not authenticated
        return NextResponse.redirect(new URL('/admin/login', req.url));
      }

      if (token.role !== 'admin') {
        // Redirect to login if not admin
        return NextResponse.redirect(new URL('/admin/login?error=AccessDenied', req.url));
      }
    }

    // API routes protection
    if (pathname.startsWith('/api/admin')) {
      if (!token) {
        return NextResponse.json(
          { error: 'Authentication required' },
          { status: 401 }
        );
      }

      if (token.role !== 'admin') {
        return NextResponse.json(
          { error: 'Admin access required' },
          { status: 403 }
        );
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        // Allow public routes
        if (
          pathname === '/' ||
          pathname.startsWith('/products') ||
          pathname.startsWith('/categories') ||
          pathname.startsWith('/tips') ||
          pathname.startsWith('/cart') ||
          pathname.startsWith('/checkout') ||
          pathname.startsWith('/contact') ||
          pathname.startsWith('/api/products') ||
          pathname.startsWith('/api/categories') ||
          pathname.startsWith('/api/tips') ||
          pathname.startsWith('/api/testimonials') ||
          pathname.startsWith('/api/contact') ||
          pathname.startsWith('/api/orders') ||
          pathname.startsWith('/api/settings') ||
          pathname.startsWith('/api/upload') ||
          pathname.startsWith('/_next') ||
          pathname.startsWith('/favicon.ico') ||
          pathname.startsWith('/images') ||
          pathname === '/admin/login'
        ) {
          return true;
        }

        // Require authentication for admin routes (except login)
        if (pathname.startsWith('/admin')) {
          return !!token;
        }

        // Require authentication for protected API routes
        if (pathname.startsWith('/api/admin')) {
          return !!token;
        }

        return true;
      }
    }
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*'
  ]
};
