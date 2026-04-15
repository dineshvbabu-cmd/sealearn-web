// Next.js middleware — runs on every matched request before rendering.
// Handles all auth-based routing so no page-level redirect is needed for protected routes.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN", "INSTRUCTOR", "REGISTRAR", "LMS_ADMIN"];
const PURE_ADMIN_ROLES = ["ADMIN", "SUPER_ADMIN"];

async function getRole(request: NextRequest): Promise<string | null> {
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  // Railway terminates SSL at the load balancer — try secure cookie first
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

  return (token?.role as string) ?? null;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = await getRole(request);
  const isLoggedIn = role !== null;

  // ── /admin routes ─────────────────────────────────────────────────────────
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || !ADMIN_ROLES.includes(role!)) {
      // Not authenticated or not a staff/admin role → admin login page
      const url = request.nextUrl.clone();
      url.pathname = "/auth/admin-login";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // ── /portal routes ────────────────────────────────────────────────────────
  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn) {
      // Not authenticated → student login
      const url = request.nextUrl.clone();
      url.pathname = "/auth/login";
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }

    // Pure admins who land on /portal → send them to admin panel
    if (PURE_ADMIN_ROLES.includes(role!)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }

    // Staff roles (INSTRUCTOR, REGISTRAR, LMS_ADMIN) are allowed into portal (read-only banner in layout)
    // Students and Cadets → allowed through
    return NextResponse.next();
  }

  // ── /auth/login ───────────────────────────────────────────────────────────
  // Already logged-in student hitting the login page → send to portal
  if (pathname === "/auth/login" && isLoggedIn) {
    if (ADMIN_ROLES.includes(role!)) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/dashboard";
      return NextResponse.redirect(url);
    }
    const url = request.nextUrl.clone();
    url.pathname = "/portal/dashboard";
    return NextResponse.redirect(url);
  }

  // ── /auth/admin-login ─────────────────────────────────────────────────────
  // Already logged-in admin hitting admin login → send to admin panel
  if (pathname === "/auth/admin-login" && isLoggedIn && ADMIN_ROLES.includes(role!)) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/dashboard";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/portal/:path*",
    "/admin/:path*",
    "/auth/login",
    "/auth/admin-login",
  ],
};
