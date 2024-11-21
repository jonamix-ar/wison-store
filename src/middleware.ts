import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

enum Role {
  ADMIN = "ADMIN",
  SELLER = "SELLER",
  WHOLESALER = "WHOLESALER",
  CUSTOMER = "CUSTOMER",
}

const protectedRoutes = {
  "/admin": [Role.ADMIN, Role.SELLER],
  "/wholesaler": [Role.WHOLESALER],
  "/customer": [Role.CUSTOMER, Role.WHOLESALER],
};

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isProtectedRoute = Object.keys(protectedRoutes).some((route) =>
    path.startsWith(route)
  );

  if (isProtectedRoute) {
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const userRole = token.role as Role;

    const allowedRoles = Object.entries(protectedRoutes).find(([route]) =>
      path.startsWith(route)
    )?.[1];

    if (!allowedRoles?.includes(userRole)) {
      return NextResponse.redirect(new URL("/access-denied", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/mayorista/:path*",
    "/cliente/:path*",
    "/checkout/:path*",
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
