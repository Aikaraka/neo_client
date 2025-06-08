"use server";
import { SignupFormType } from "@/app/(auth)/signup/schema";
import { createClient } from "@/utils/supabase/server";

// 더 이상 사용하지 않음 - Supabase Auth가 자체적으로 중복 체크를 수행
// export const checkEmailDuplication = async (email: string) => { ... }

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

  // public.users 테이블 중복 체크 제거
  // Supabase Auth가 자체적으로 처리하도록 함

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
      console.error("Supabase signup error:", error);
      
      // Supabase Auth에서 이미 존재하는 사용자 에러 처리
      if (error.message?.includes("User already registered") || 
          error.message?.includes("already exists") ||
          error.code === "user_already_exists") {
        return { 
          authData: null, 
          error: { 
            message: "이미 가입된 이메일입니다. 이메일 인증을 완료하거나 로그인해주세요.", 
            name: "UserAlreadyExists" 
          } 
        };
      }
      
      return { authData: null, error };
    }
    
    console.log("Signup successful for:", email);
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
