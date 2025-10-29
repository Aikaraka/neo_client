import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

const protectedRoutes = [
  "/dashboard",
  "/profile",
  "/settings",
  "/mypage",
  "/storage",
  "/create",
  "/novel", // 세계관 진입 시 로그인 필수
];
const adminRoutes = ["/admin"];
const authRoutes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // User-Agent 체크
  const ua = request.headers.get('user-agent') || '';
  const isSentryBot = ua.includes('SentryUptimeBot');

  // 봇이 이미지 최적화 경로 접근 시 차단 (Quota 절약)
  const isImageOptimization = pathname.startsWith('/_next/image');
  const isBot = /bot|crawler|spider|crawling|facebook|whatsapp|telegram/i.test(ua);

  if (isImageOptimization && isBot && !isSentryBot) {
    // 봇의 이미지 최적화 요청 차단
    return new NextResponse('Forbidden', { status: 403 });
  }

  // Sentry Uptime Monitor 봇 처리
  if (isSentryBot && pathname === '/') {
    // 헬스체크 엔드포인트로 리다이렉트
    return NextResponse.rewrite(new URL('/healthz', request.url));
  }

  // 세션 업데이트 처리 및 supabase 인스턴스 가져오기
  const { supabaseResponse, user, supabase } = await updateSession(request);

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

    if (adminRoutes.some((route) => pathname.startsWith(route))) {
      if (!userData || userData.role !== "admin") {
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
