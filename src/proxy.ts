import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Detect HTTPS (production) so we look for the __Secure- prefixed cookie.
  // next-auth v5 uses "authjs.session-token" on HTTP and
  // "__Secure-authjs.session-token" on HTTPS.
  const isSecure = request.url.startsWith("https://");

  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
    secureCookie: isSecure,
    cookieName: isSecure
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
    // salt must match the cookie name used when the JWT was encrypted
    salt: isSecure
      ? "__Secure-authjs.session-token"
      : "authjs.session-token",
  });

  const { pathname } = request.nextUrl;
  const isLoggedIn = !!token;
  const role = token?.role as string | undefined;

  // Admin routes — redirect to admin login, not student login
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/auth/admin-login", request.url));
    }
  }

  // Portal routes — redirect to student login
  if (pathname.startsWith("/portal")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*"],
};
