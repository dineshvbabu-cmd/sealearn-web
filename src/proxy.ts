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

  // Admin routes — only ADMIN / SUPER_ADMIN
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || !isAdmin) {
      return NextResponse.redirect(new URL("/auth/admin-login", request.url));
    }
  }

  // Portal routes — must be logged in AND not an admin account
  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
    // Admins should use the admin panel, not the student portal
    if (isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
