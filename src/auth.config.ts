import type { NextAuthConfig } from "next-auth";
import { NextResponse } from "next/server";
import { safeRedirectUrl } from "@/lib/auth/callback-url";

export const authConfig = {
  pages: {
    signIn: "/dang-nhap",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    authorized({ auth, request }) {
      const isAccountRoute = request.nextUrl.pathname.startsWith("/tai-khoan");

      if (!isAccountRoute || auth?.user) {
        return true;
      }

      const callbackUrl = `${request.nextUrl.pathname}${request.nextUrl.search}`;
      const signInUrl = new URL("/dang-nhap", request.nextUrl);
      signInUrl.searchParams.set("callbackUrl", callbackUrl);
      return NextResponse.redirect(signInUrl);
    },
    redirect({ url, baseUrl }) {
      return safeRedirectUrl(url, baseUrl);
    },
  },
  providers: [],
} satisfies NextAuthConfig;

