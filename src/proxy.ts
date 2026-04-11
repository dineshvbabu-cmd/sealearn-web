import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/auth";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isLoggedIn = !!session;
  const role = (session?.user as { role?: string })?.role;

  if (pathname.startsWith("/admin")) {
    if (!isLoggedIn || (role !== "ADMIN" && role !== "SUPER_ADMIN")) {
      return NextResponse.redirect(new URL("/auth/admin-login", request.url));
    }
  }

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
