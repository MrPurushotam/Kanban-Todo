import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard'];
const authRoutes = ['/login'];

export function middleware(req: NextRequest) {
  console.log(req.cookies)
  const authCookie = req.cookies.get('authenticate');
  console.log(authCookie)
  const isAuth = authCookie?.value === 'true';
  console.log(isAuth)
  
  const path = req.nextUrl.pathname;
  console.log(path)
  
  console.log(!isAuth && authRoutes.some(route => path.startsWith(route)))
  if (isAuth && authRoutes.some(route => path.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  if (!isAuth && protectedRoutes.some(route => path.startsWith(route))) {
    const loginUrl = new URL('/login', req.url);
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