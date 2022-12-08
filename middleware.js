import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

export async function middleware(req) {
    // Calling useRouter() hook

    // Token will exist if user is logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET });

    const { pathname } = req.nextUrl;

    // Allow the requests if the following is true...
    // 1) Its a request for next-auth session & provider fetching
    // 2) the token exists

    if (token && pathname === '/login') {
        return NextResponse.redirect(new URL('/', req.url));
    }

    if (pathname.includes('/api/auth/') || token) {
        return NextResponse.next();
    }

    //Redirect them to login if they not have token AND are requesting a protected route

    if (!token && pathname !== '/login') {
        // return NextResponse.redirect('/login');
        // return NextResponse.redirect('/login');
        return NextResponse.redirect(new URL('/login', req.url));
    }

}

// See "Matching Paths" below to learn more
export const config = {
    // matcher: ["/:path*", "/login"],
    matcher: ["/", "/login"],
}

// export const config = {
//     unstable_includeFiles: [
//         'node_modules/next/dist/compiled/@edge-runtime/primitives/**/*.+(js|json)',
//     ],
// }