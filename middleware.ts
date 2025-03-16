import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/mypage",
  "/storage",
  "/create",
];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  // 세션 업데이트 처리
  const { supabaseResponse, user } = await updateSession(request);
  const supabase = await createClient();
  const { pathname } = request.nextUrl;

  if (user) {
    const { data: userData } = await supabase
      .from("users")
      .select()
      .eq("id", user.id)
      .single();

    if (!userData?.profile_completed && pathname !== "/auth/setting") {
      const profileSettingURL = new URL("/auth/setting", request.url);
      return NextResponse.redirect(profileSettingURL);
    }

    if (adminRoutes.includes(request.nextUrl.pathname)) {
      if (
        !JSON.parse(process.env.NEXT_PUBLIC_ADMIN_EMAIL || "[]").includes(
          user.email || "NOT FOUND"
        )
      ) {
        console.error("관리자 권한이 없습니다.");
        const mainURL = new URL("/", request.url);
        return NextResponse.redirect(mainURL);
      }
    }

    if (userData?.profile_completed && pathname === "/auth/setting") {
      const mainURL = new URL("/", request.url);
      return NextResponse.redirect(mainURL);
    }

    if (authRoutes.includes(pathname)) {
      const redirectUrl = new URL("/", request.url);
      const redirectResponse = NextResponse.redirect(redirectUrl);

      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });

      return redirectResponse;
    }
  } else {
    if (protectedRoutes.some((route) => pathname.startsWith(route))) {
      const redirectUrl = new URL("/login", request.url);
      redirectUrl.searchParams.set("returnUrl", pathname);
      const redirectResponse = NextResponse.redirect(redirectUrl);

      // 쿠키 복사
      supabaseResponse.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
      });

      return redirectResponse;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
