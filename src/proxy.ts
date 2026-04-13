import { auth } from "./auth.edge";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Use the edge-compatible auth wrapper (reads JWT cookie internally)
export default auth(function proxy(req) {
  const session = req.auth;
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!session;
  const role = (session?.user as { role?: string } | null)?.role;

  // Admin routes — redirect to admin login, not student login
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/auth/admin-login", req.url));
    }
  }

  // Portal routes — redirect to student login
  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
