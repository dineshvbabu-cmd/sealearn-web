// Edge-compatible auth instance — no Prisma, no bcrypt
// Used only in proxy.ts (Edge runtime) to read JWT sessions
import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export const { auth } = NextAuth(authConfig);
