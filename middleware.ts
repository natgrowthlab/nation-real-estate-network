import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "./src/auth/session";

const openPaths = ["/login", "/setup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith("/api/") || openPaths.some((path) => pathname === path)) return NextResponse.next();
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token && await verifySession(token)) return NextResponse.next();
  const url = new URL("/login", request.url);
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"] };
