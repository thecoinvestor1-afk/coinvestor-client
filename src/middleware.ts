// import { betterFetch } from "@better-fetch/fetch";
// import { Session } from "better-auth/types";
import {  NextResponse } from "next/server";

export async function middleware() {
//   const { data: session } = await betterFetch<Session>(
//     "/api/auth/get-session",
//     {
//       baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
//       headers: {
//         cookie: request.headers.get("cookie") || "", // Forward the cookies from the request
//       },
//     },
//   );

//   // if the session is found and the request is for the auth page, redirect to /me
//   if (session && request.url.includes("/auth")) {
//     return NextResponse.redirect(new URL("/profile", request.url));
//   }

//   // if the session is not found and the request is for /me or /auth, redirect to /auth/sign-in
//   if (
//     !session &&
//     !request.url.includes("/auth/sign-in") &&
//     !request.url.includes("/auth/sign-up")
//   ) {
//     return NextResponse.redirect(new URL("/auth/sign-in", request.url));
//   }

  return NextResponse.next();
}

export const config = {
  matcher: ["/me", "/auth/:auth*"],
};
