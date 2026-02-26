import { NextResponse } from "next/server";
import auth from "./lib/auth.middlewere";

const publicRoutes = ["/auth/login", "/auth/forgot-password"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isPublic = publicRoutes.some((r) => pathname.startsWith(r));
  const isAuth = !!req.auth?.user;

  if (isAuth && isPublic && pathname !== "/unauthorized") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isPublic && !isAuth) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
