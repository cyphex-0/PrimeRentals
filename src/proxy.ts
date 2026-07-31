import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage = pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    if (!token) {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }

    const payload = decodeJwt(token);
    if (!payload || !payload.role) {
      const response = NextResponse.redirect(new URL("/auth/login", request.url));
      response.cookies.delete("token");
      return response;
    }

    const role = payload.role.toLowerCase();

    // Enforce role boundaries
    if (pathname.startsWith("/dashboard/tenant") && role !== "tenant") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    if (pathname.startsWith("/dashboard/landlord") && role !== "landlord") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
    
    // Redirect base dashboard path
    if (pathname === "/dashboard") {
      return NextResponse.redirect(new URL(`/dashboard/${role}`, request.url));
    }
  }

  if (isAuthPage && token) {
    const payload = decodeJwt(token);
    if (payload && payload.role) {
      return NextResponse.redirect(new URL(`/dashboard/${payload.role.toLowerCase()}`, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
};
