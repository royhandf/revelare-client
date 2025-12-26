import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function proxy(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;
    const role = token?.role;

    if (role === "admin" && !pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (role === "user" && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (pathname.startsWith("/dashboard")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/", "/book/:path*"],
};
