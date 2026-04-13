import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isPortal = nextUrl.pathname.startsWith("/portal");
      const isAdmin = nextUrl.pathname.startsWith("/admin");

      if (isAdmin) {
        if (!isLoggedIn) return false;
        const role = (auth?.user as { role?: string })?.role;
        return role === "ADMIN" || role === "SUPER_ADMIN";
      }

      if (isPortal) return isLoggedIn;

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id ?? "";
        token.role = (user as { role?: string }).role ?? "STUDENT";
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // filled in auth.ts
};
