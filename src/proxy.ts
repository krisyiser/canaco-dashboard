import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    const auth = request.cookies.get('auth_user')?.value;
    const path = request.nextUrl.pathname;

    const publicPaths = ['/login', '/canaco.png', '/favicon.ico'];
    if (publicPaths.some(p => path.startsWith(p)) || path.startsWith('/api') || path.startsWith('/_next')) {
        if (auth && path === '/login') {
            if (auth === 'oficina') return NextResponse.redirect(new URL('/socios/canaco', request.url));
            return NextResponse.redirect(new URL('/', request.url));
        }
        return NextResponse.next();
    }

    if (!auth) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (auth === 'oficina') {
        if (!path.startsWith('/socios') && !path.startsWith('/finanzas')) {
            return NextResponse.redirect(new URL('/socios/canaco', request.url));
        }
    } else if (auth === 'consejo') {
        if (path !== '/') {
            return NextResponse.redirect(new URL('/', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico|canaco.png).*)'],
};
