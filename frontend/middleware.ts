import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login'];

export function middleware(req: NextRequest) {
  const authCookie = req.cookies.get('authenticate');
  const isAuth = authCookie?.value === 'true';

  const path = req.nextUrl.pathname;

  if (isAuth && authRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (!isAuth && protectedRoutes.some(route => path.startsWith(route))) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/login',
  ],
};