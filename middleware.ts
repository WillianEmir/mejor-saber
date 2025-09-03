export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/admin/:path*",
    "/dashboard/ejercicios-practica/:path*",
    "/dashboard/material-estudio/:path*",
    "/dashboard/mi-progreso/:path*",
    "/dashboard/profile/:path*",
    "/dashboard/simulacros/:path*",
  ],
};
