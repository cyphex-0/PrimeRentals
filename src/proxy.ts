import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken");
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard && !refreshToken) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthPage && refreshToken) {
    return NextResponse.redirect(new URL("/dashboard/tenant", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
