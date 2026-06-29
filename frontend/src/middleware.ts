import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Decode JWT payload (middle part of the token)
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      const allowedRoles = ['SUPER_ADMIN', 'PRODUCT_ADMIN'];
      if (!allowedRoles.includes(payload.role)) {
        // Redirect to home if they are logged in but not admin
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (err) {
      // If token is malformed, clear and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('token');
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
