// import { auth } from "@/auth";
// import { NextResponse } from "next/server";

// export default auth((req) => {
//   const { pathname } = req.nextUrl;
  
//   // Rutas protegidas
//   if (pathname.startsWith("/dashboard") && !req.auth) {
//     return NextResponse.redirect(new URL("/auth/login", req.url));
//   }

//   // Rutas de admin
//   if (pathname.startsWith("/admin") && req.auth?.user?.role !== "admin") {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   return NextResponse.next();
// });

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"]
// };


// import { NextResponse } from "next/server";
// import { auth } from "@/auth";
import type { NextRequest } from "next/server";
// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { updateSession } from "./lib/supabase/middleware";


// const protectedRoutes = ["/admin"];

export default async function middleware(req: NextRequest) {

   return await updateSession(req)
  // const res = NextResponse.next()
  // const supabase = createMiddlewareClient({ req, res })

  // const { data: { user } } = await supabase.auth.getUser()

  // const { pathname } = req.nextUrl;

  // const isProtected = protectedRoutes.some((route) =>
  //   pathname.startsWith(route)
  // );

  // if (isProtected && !user) {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // return NextResponse.next();
}

// Excluir Prisma del middleware
export const config = {
  // matcher: ["/((?!api|_next/static|_next/image|favicon.ico|prisma).*)"]
  matcher: ["/((?!_next/static|_next/image|favicon.ico|prisma.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
    
};
