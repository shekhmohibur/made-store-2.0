import { NextResponse } from "next/server";
import { verifyToken } from "./lib/auth";

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("atelier_session")?.value;
  const session = token ? await verifyToken(token) : null;

  // Protect Admin Panel: require ADMIN role
  if (pathname.startsWith("/admin")) {
    if (!session) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", req.url));
    }
    if (session.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/account", req.url));
    }
  }

  // Protect Customer Account Page: require login
  if (pathname.startsWith("/account") && !session) {
    return NextResponse.redirect(new URL("/login?redirect=/account", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};