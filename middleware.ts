import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Minimal middleware that allows all requests for now
export function middleware(request: NextRequest) {
  // Allow all requests to pass through without authentication checks
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
