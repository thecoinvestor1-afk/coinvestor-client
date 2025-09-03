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

    // console.log("session: ", session);

    const url = request.nextUrl.clone();
    const pathname = url.pathname;

    // If user has a valid session (Better Auth returns session object with user property)
    if (session?.user && session?.session) {
      const user = session.user;
      
      // Check phone number verification status
      if (!user.phoneNumberVerified) {
        // Keep user on sign-up, sign-in, or homepage only
        if (pathname === '/sign-up' || pathname === '/sign-in' || pathname === '/' || pathname.startsWith('/auth/')) {
          return NextResponse.next();
        }
        
        // Redirect unverified users to homepage from any other route
        url.pathname = '/';
        return NextResponse.redirect(url);
      }

      // Phone number is verified - handle redirects based on redirectUrl
      if (user.phoneNumberVerified) {
        // If user is trying to access auth pages when already logged in and verified
        if (pathname.startsWith('/auth/') || pathname === '/sign-up' || pathname === '/sign-in') {
          // Redirect based on redirectUrl field
          if (user.redirectUrl === 'upload') {
            url.pathname = '/upload';
          } else if (user.redirectUrl === 'dashboard') {
            url.pathname = '/dashboard';
          } else {
            // Default redirect if redirectUrl is something else
            url.pathname = '/dashboard';
          }
          return NextResponse.redirect(url);
        }

        // For verified users, enforce redirect URL restrictions
        if (user.redirectUrl === 'upload') {
          // User should only be on /upload route
          if (pathname !== '/upload') {
            url.pathname = '/upload';
            return NextResponse.redirect(url);
          }
        } else if (user.redirectUrl === 'dashboard') {
          // User should be on /dashboard route
          if (pathname !== '/dashboard') {
            url.pathname = '/dashboard';
            return NextResponse.redirect(url);
          }
        }
        
        // Allow access to the current route if it matches their redirectUrl
        return NextResponse.next();
      }
    }

    // If no session (user not authenticated)
    // Allow access to auth pages and homepage
    if (pathname.startsWith('/auth/') || pathname === '/sign-up' || pathname === '/sign-in' || pathname === '/') {
      return NextResponse.next();
    }

    // Redirect unauthenticated users trying to access protected routes to sign-in
    if (pathname === '/upload' || pathname === '/dashboard' || pathname.startsWith('/profile')) {
      url.pathname = '/sign-in';
      return NextResponse.redirect(url);
    }

    // Allow access to other public routes
    return NextResponse.next();

  } catch (error) {
    console.error('Middleware error:', error);
    // On error, redirect to sign-in as fallback
    if (!request.nextUrl.pathname.startsWith('/auth/') && 
        request.nextUrl.pathname !== '/sign-in' && 
        request.nextUrl.pathname !== '/sign-up' &&
        request.nextUrl.pathname !== '/') {
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