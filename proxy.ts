import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Next.js 16 `proxy` (formerly `middleware`).
 *
 * Refreshes the Supabase auth session on every request so server components
 * always see a fresh token, and gates the `(app)` route group behind auth.
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  // Demo mode: no Supabase configured, or NEXT_PUBLIC_DEMO=1. Let everything through.
  if (process.env.NEXT_PUBLIC_DEMO === "1") return response;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return response;

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll: (cookiesToSet) => {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  // IMPORTANT: must call getUser() to refresh the session cookie.
  const { data: { user } } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Auth-gated areas
  const protectedPaths = ["/discover", "/map", "/activities", "/wings", "/messages", "/profile", "/onboarding"];
  if (!user && protectedPaths.some((p) => pathname.startsWith(p))) {
    const signIn = request.nextUrl.clone();
    signIn.pathname = "/signin";
    signIn.searchParams.set("next", pathname);
    return NextResponse.redirect(signIn);
  }

  // Auth pages should bounce signed-in users to /discover
  if (user && (pathname === "/signin" || pathname === "/signup")) {
    const url = request.nextUrl.clone();
    url.pathname = "/discover";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // Run on everything except Next assets, favicon, fonts, and images
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|woff2?)$).*)",
  ],
};
