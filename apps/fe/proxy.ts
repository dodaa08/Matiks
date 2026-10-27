import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_URL = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL!;

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");

  if (!token) {
    if (isAuthPage) return NextResponse.next();
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  let isValid = false;
  try {
    const res = await fetch(`${API_URL}/api/v1/auth/me`, {
      headers: { cookie: req.headers.get("cookie") ?? "" },
    });
    isValid = res.ok;
  } catch {
    isValid = false;
  }

  if (!isValid) {
    const res = isAuthPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/auth/signin", req.url));
    res.cookies.delete("token"); // clear the stale cookie
    return res;
  }

  // Logged-in users shouldn't see signin/signup
  if (isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/game/:path*", "/auth/:path*"],
};