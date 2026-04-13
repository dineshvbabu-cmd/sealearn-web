// Edge-compatible route guard — runs before every request matching the config.
// Uses next-auth/jwt getToken to read the JWT directly from cookies (no Prisma/bcrypt).
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

  // Admin routes — must be ADMIN or SUPER_ADMIN
  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }

  // Portal routes — must be logged in
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
