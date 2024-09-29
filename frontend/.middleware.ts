import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
    const authenticate = req.cookies?.get('authenticate');
    const token = req.cookies?.get('token');
    const url = req.nextUrl;
    console.log(String(authenticate) ==='true' && token)
    if (String(authenticate) ==='true' && token) {
        if (url.pathname === '/login') {
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    if (!authenticate || !token) {
        if (url.pathname === '/dashboard') {
            url.pathname = '/login';
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }
}

export const config = {
    matcher: ['/login', '/dashboard'],  
};
