import { NextResponse } from 'next/server' 
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = request.nextUrl;

  // If there's no token, redirect to login. 
  // This is a fallback, as the default middleware should handle this.
  if (!token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url)); 
  }

  // const userRole = token.role as string;
  // const dashboardRedirectUrl = new URL('/dashboard', request.url);

  // // Role-based access control
  // if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
  //   return NextResponse.redirect(dashboardRedirectUrl);
  // }

  // if (pathname.startsWith('/dashboard/school') && userRole !== 'ADMINSCHOOL') {
  //   return NextResponse.redirect(dashboardRedirectUrl);
  // }

  // if (pathname.startsWith('/dashboard/user') && userRole !== 'USER') {
  //   return NextResponse.redirect(dashboardRedirectUrl);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/user/:path*',
    '/dashboard/admin/:path*',
    '/dashboard/school/:path*',
  ],
};