import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Simple pass-through middleware
  return NextResponse.next();
}

// Only run middleware on specific paths if needed
export const config = {
  matcher: [
    // Add path patterns here if needed
  ],
}; 