import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token");
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard && !token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthPage && token) {
    // If we have a token, we don't know the exact role yet without fetching, 
    // but we can redirect to a common protected route and let the client layout handle the final redirect based on role.
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
