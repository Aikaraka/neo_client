"use server";
import { SignupFormType } from "@/app/(auth)/signup/schema";
import { createClient } from "@/utils/supabase/server";

// 인증 메일 재전송 함수
export const resendConfirmationEmail = async (email: string) => {
  const supabase = await createClient();
  
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email: email,
    options: {
      emailRedirectTo: `${baseUrl}/auth/callback`,
    }
  });

  if (error) {
    return { 
      success: false, 
      error: { 
        message: "이메일 재전송에 실패했습니다. 잠시 후 다시 시도해주세요.",
        name: "ResendFailed"
      } 
    };
  }

  return { success: true, error: null };
};

export const signup = async ({
  email,
  password,
}: Pick<SignupFormType, "email" | "password">) => {
  const supabase = await createClient();

  // 현재 세션 확인
  const { data: { session } } = await supabase.auth.getSession();
  
  // 이미 로그인된 사용자라면 에러 반환
  if (session?.user) {
    return { 
      authData: null, 
      error: { 
        message: "이미 로그인된 상태입니다. 로그아웃 후 다시 시도해주세요.", 
        name: "AlreadyAuthenticated" 
      } 
    };
  }

  // public.users 테이블에서 이메일 중복 체크
  // public.users에 있다 = 이미 인증 완료된 사용자
  const { data: existingUser } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (existingUser) {
    return {
      authData: null,
      error: {
        message: "이미 가입된 이메일입니다. 로그인을 시도하거나 비밀번호 찾기를 이용해주세요.",
        name: "UserAlreadyExists",
        canResend: false
      }
    };
  }

  // 동적으로 현재 도메인 사용 (localhost 또는 vercel 배포 도메인)
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

  try {
    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${baseUrl}/auth/callback`,
      },
    });

    if (error) {
      console.error("Supabase signup error details:", {
        message: error.message,
        status: error.status,
        code: error.code,
        name: error.name
      });
      
      // 이메일 전송 실패 에러 처리
      if (error.message?.includes("Error sending confirmation email") ||
          error.message?.includes("sending email")) {
        return { 
          authData: null, 
          error: { 
            message: "이메일 전송에 실패했습니다. 이메일 주소를 확인하고 다시 시도해주세요.", 
            name: "EmailSendingError" 
          } 
        };
      }
      
      // Supabase Auth에서 이미 존재하는 사용자 에러 처리
      // auth.users에는 있지만 public.users에는 없음 = 미인증 사용자
      if (error.message?.includes("User already registered") || 
          error.message?.includes("already exists") ||
          error.code === "user_already_exists") {
        return { 
          authData: null, 
          error: { 
            message: "이미 가입 요청한 이메일입니다.\n이전에 발송된 인증 메일을 확인하지 않으셨어요. 재전송 해드릴까요?", 
            name: "EmailNotConfirmed",
            canResend: true,
            email: email  // 재전송에 필요
          } 
        };
      }
      
      return { authData: null, error };
    }
    
    return { authData, error: null };
  } catch (exception) {
    console.error("Signup exception:", exception);
    const errorMessage =
      exception instanceof Error ? exception.message : "An unknown error occurred";
    return {
      authData: null,
      error: { message: errorMessage, name: "SignupException" },
    };
  }
};
