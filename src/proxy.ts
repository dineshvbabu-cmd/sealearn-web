import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const isLoggedIn = !!token;
  const role = token?.role as string | undefined;

  // Admin routes — redirect to ADMIN login, not student login
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
