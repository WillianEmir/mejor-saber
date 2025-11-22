import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  if (!req.auth) {
    return NextResponse.redirect(new URL('/auth/signin', req.url));  
  }

  const userRole = req.auth.user?.role as string;
  const { pathname } = req.nextUrl;

  const dashboardRedirectUrl = new URL('/', req.url);

  if (pathname.startsWith('/dashboard/admin') && userRole !== 'ADMIN') {
    return NextResponse.redirect(dashboardRedirectUrl);
  }

  if (pathname.startsWith('/dashboard/school') && userRole !== 'ADMINSCHOOL' && userRole !== 'ADMIN') {
    return NextResponse.redirect(dashboardRedirectUrl);
  }

  if (pathname.startsWith('/dashboard/user') && userRole !== 'USER' && userRole !== 'ADMIN') {
    return NextResponse.redirect(dashboardRedirectUrl);
  }

  return NextResponse.next();
})

// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/dashboard/:path*"],
}