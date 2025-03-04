// import { auth } from "@/app/_lib/auth";

// import { NextResponse } from "next/server";

// export async function middleware(req) {
//   const session = await auth();

//   if (!session?.user) return NextResponse.redirect(new URL("/about", req.url));
// }

// import { auth } from "@/app/_services/auth";

// export const middleware = auth;

// export const config = {
//   matcher: ["/account"],
// };

import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token && req.nextUrl.pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/login", req.url)); // Redirect if not logged in
  }

  return NextResponse.next(); // Allow request if authenticated
}

export const config = {
  matcher: ["/forYou", "/popularPlaces"], // Protect /dashboard and its subpages
};
