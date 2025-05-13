// middleware.js
import {NextResponse} from 'next/server';

export async function middleware(request) {
    const { pathname } = request.nextUrl;
    const authToken = request.cookies.get('auth_token')?.value;
    const role = request.cookies.get('role')?.value;

    // Redirect to access denied page for unauthorized access
    const redirectToAccessDenied = () => {
        return NextResponse.redirect(new URL('/access-denied', request.url));
    };

    // Redirect conditions
    if (pathname.startsWith('/admin')) {
        if (!authToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (role !== 'admin') {
            return redirectToAccessDenied();
        }
    } else if (pathname.startsWith('/manager')) {
        if (!authToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (role !== 'admin' && role !== 'manager') {
            return redirectToAccessDenied();
        }
    } else if (pathname === '/my-orders') {
        if (!authToken) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        if (role === 'admin') {
            return NextResponse.redirect(new URL('/admin', request.url));
        }
        if (role === 'manager') {
            return NextResponse.redirect(new URL('/manager/sales', request.url));
        }
    } else if (pathname === '/login') {
        if (authToken) {
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            if (role === 'manager') {
                return NextResponse.redirect(new URL('/manager/sales', request.url));
            }
            if (role === 'customer') {
                return NextResponse.redirect(new URL('/my-orders', request.url));
            }
        }
    } else if (pathname === '/register') {
        if (authToken) {
            if (role === 'admin') {
                return NextResponse.redirect(new URL('/admin', request.url));
            }
            if (role === 'manager') {
                return NextResponse.redirect(new URL('/manager/sales', request.url));
            }
            if (role === 'customer') {
                return NextResponse.redirect(new URL('/my-orders', request.url));
            }
        }
    }

    return NextResponse.next();
}