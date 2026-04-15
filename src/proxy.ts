import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  // Railway (and many hosts) terminate SSL at their load balancer and proxy
  // HTTP internally, so request.url shows "http://" even though the browser
  // connected over HTTPS and the cookie was set as "__Secure-authjs.session-token".
  // Solution: try the secure cookie name first, then fall back to non-secure.
  let token = await getToken({
    req: request,
    secret,
    secureCookie: true,
    cookieName: "__Secure-authjs.session-token",
    salt: "__Secure-authjs.session-token",
  });

  if (!token) {
    token = await getToken({
      req: request,
      secret,
      secureCookie: false,
      cookieName: "authjs.session-token",
      salt: "authjs.session-token",
    });
  }

  const { pathname } = request.nextUrl;
  const isLoggedIn = !!token;
  const role = token?.role as string | undefined;
  const isAdmin = role === "ADMIN" || role === "SUPER_ADMIN";
  const isStaff = role === "INSTRUCTOR" || role === "REGISTRAR" || role === "LMS_ADMIN";
  const hasAdminAccess = isAdmin || isStaff;

  // Admin routes — ADMIN, SUPER_ADMIN, INSTRUCTOR, REGISTRAR
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || !hasAdminAccess) {
      return NextResponse.redirect(new URL("/auth/admin-login", request.url));
    }
  }

  // Portal routes — must be logged in; admins redirect to admin panel, staff can view portal (read-only)
  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    // Pure admins → admin panel; staff (INSTRUCTOR/REGISTRAR) may browse portal in read-only mode
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
