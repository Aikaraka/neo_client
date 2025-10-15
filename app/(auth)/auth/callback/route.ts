import {
  getSession,
  getuser,
  insertNewUser,
} from "@/app/(auth)/auth/callback/callback.api";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import * as Sentry from "@sentry/nextjs";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  try {
    if (!code) {
      return NextResponse.redirect(new URL("/login", requestUrl));
    }
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(
      code
    );
    if (exchangeError) {
      Sentry.captureException(exchangeError, {
        tags: { error_type: "exchange_code_error", context: "auth_callback" },
      });
      return NextResponse.redirect(new URL("/login", requestUrl));
    }

    const {
      data: { session },
      error: sessionError,
    } = await getSession(supabase);
    if (sessionError || !session?.user) {
      Sentry.captureException(sessionError || new Error("No session after exchange"), {
        tags: { error_type: "session_error", context: "auth_callback" },
      });
      return NextResponse.redirect(new URL("/login", requestUrl));
    }

    const { data: existingUser, error: getUserError } = await getuser(session, supabase);

    if (getUserError && getUserError.code !== 'PGRST116') {
      Sentry.captureException(getUserError, {
        tags: { error_type: "get_user_error", context: "auth_callback" },
      });
      return NextResponse.redirect(new URL("/login", requestUrl));
    }

    if (!existingUser) {
      const { error: insertError } = await insertNewUser(session, supabase);
      if (insertError) {
        Sentry.captureException(insertError, {
          tags: { error_type: "insert_user_error", context: "auth_callback" },
          extra: { userId: session.user.id, email: session.user.email },
        });
        console.error("사용자 생성 실패:", insertError);
        // 사용자 생성 실패해도 설정 페이지로 이동하여 재시도 가능하도록 함
      } else {
        // ✅ 신규 회원가입 성공 로깅
        Sentry.captureMessage("신규 유저 가입 성공", {
          level: "info",
          tags: { 
            event_type: "user_signup", 
            context: "auth_callback" 
          },
          user: {
            id: session.user.id,
            email: session.user.email || undefined,
          },
          extra: {
            provider: session.user.app_metadata?.provider,
            timestamp: new Date().toISOString(),
          }
        });
      }
      return NextResponse.redirect(new URL("/auth/setting", requestUrl));
    }

    if (!existingUser.profile_completed) {
      return NextResponse.redirect(new URL("/auth/setting", requestUrl));
    }

    return NextResponse.redirect(new URL("/", requestUrl));
  } catch (error) {
    Sentry.captureException(error, {
      tags: { error_type: "auth_callback_general_error", context: "auth_callback" },
      extra: { url: request.url, code },
    });
    console.error("Auth callback error:", error);
    return NextResponse.redirect(
      `${requestUrl.origin}/auth/login?message=로그인에 실패했습니다.`,
      {
        status: 301,
      },
    );
  }
}
