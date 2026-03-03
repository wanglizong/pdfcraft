import createMiddleware from 'next-intl/middleware';
import { routing } from '@/i18n/routing';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
    const response = intlMiddleware(request);

    // Required for SharedArrayBuffer (LibreOffice WASM)
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    response.headers.set('Cross-Origin-Resource-Policy', 'cross-origin');

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*).*)',
    ],
};
