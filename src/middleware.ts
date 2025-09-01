import { betterFetch } from "@better-fetch/fetch";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // Get session from Better Auth
    const { data: session, error } = await betterFetch<{
      session: any;
      user: any;
    }>(
      "/api/auth/get-session",
      {
        baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      },
    );

    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // If user has a valid session (Better Auth returns session object with user property)
    if (session?.user && session?.session) {
      // Check if user is trying to access auth pages when already logged in
      if (pathname.startsWith('/auth/') || pathname === '/sign-up' || pathname === '/sign-in') {
        // Redirect authenticated users away from auth pages to /upload
        url.pathname = '/upload';
        return NextResponse.redirect(url);
      }
      
      // Allow access to protected routes
      return NextResponse.next();
    }

    // If no session (user not authenticated)
    // Allow access to auth pages
    if (pathname.startsWith('/auth/') || pathname === '/sign-up' || pathname === '/sign-in') {
      return NextResponse.next();
    }

    // Redirect unauthenticated users trying to access protected routes to sign-in
    if (pathname === '/upload' || pathname === '/dashboard' || pathname.startsWith('/profile')) {
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }

    // Allow access to public routes (home, about, etc.)
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to sign-in as fallback
    if (!request.nextUrl.pathname.startsWith('/auth/') && 
        request.nextUrl.pathname !== '/sign-in' && 
        request.nextUrl.pathname !== '/sign-up') {
      const url = request.nextUrl.clone();
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/sign-up",
    "/sign-in", 
    "/upload",
    "/dashboard",
    "/profile/:path*"
  ],
};