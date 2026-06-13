export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/subjects/:path*",
    "/questions/:path*",
    "/quiz/:path*",
    "/progress/:path*",
    "/bookmarks/:path*",
    "/settings/:path*",
    "/pricing/:path*",
    "/admin/:path*",
  ],
};
