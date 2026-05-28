import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VR_HOSTNAME_PREFIX = 'vr.';
const VR_SUBDOMAIN       = 'https://vr.innovationfurniture.in';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') ?? '';
  const { pathname } = request.nextUrl;

  // ── VR subdomain: rewrite all paths into /vr namespace ──────────────────────
  if (hostname.startsWith(VR_HOSTNAME_PREFIX)) {
    if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
      return NextResponse.next();
    }
    if (pathname.startsWith('/vr')) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = pathname === '/' ? '/vr' : `/vr${pathname}`;
    return NextResponse.rewrite(url);
  }

  // ── Main domain: /vr/* → redirect to VR subdomain ───────────────────────────
  if (pathname.startsWith('/vr')) {
    const subPath = pathname.replace(/^\/vr/, '') || '/';
    return NextResponse.redirect(`${VR_SUBDOMAIN}${subPath}`);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.svg$|.*\\.png$|.*\\.jpg$).*)'],
};
