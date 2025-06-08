"use server";
import { createClient } from "@/utils/supabase/server";
import * as Sentry from "@sentry/nextjs";

export const initialProfileSubmit = async (
  name: string,
  nickname: string,
  birthdate: string,
  gender: string,
  marketing: boolean
) => {
  const supabase = await createClient();
  
  try {
    // 세션과 사용자 정보를 동시에 가져와서 더 안정적으로 처리
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    // 디버깅을 위한 상세한 로깅
    console.log("Session status:", {
      hasSession: !!session,
      hasUser: !!user,
      sessionError: sessionError?.message,
      userError: userError?.message,
      userId: user?.id,
      userEmail: user?.email,
    });

    // Sentry에 컨텍스트 정보 추가
    Sentry.setContext("profile_initialization", {
      hasSession: !!session,
      hasUser: !!user,
      sessionError: sessionError?.message,
      userError: userError?.message,
      userId: user?.id,
      userEmail: user?.email,
    });

    if (sessionError || userError) {
      const errorMessage = `인증 오류 발생: ${sessionError?.message || userError?.message}`;
      Sentry.captureException(new Error(errorMessage), {
        tags: {
          error_type: "auth_session_error",
          context: "profile_initialization"
        }
      });
      throw new Error("인증 상태를 확인할 수 없습니다. 다시 로그인해주세요.");
    }

    if (!session) {
      Sentry.captureException(new Error("세션이 존재하지 않음"), {
        tags: {
          error_type: "no_session",
          context: "profile_initialization"
        }
      });
      throw new Error("세션이 만료되었습니다. 다시 로그인해주세요.");
    }

    if (!user) {
      Sentry.captureException(new Error("사용자 정보를 찾을 수 없습니다"), {
        tags: {
          error_type: "no_user",
          context: "profile_initialization"
        }
      });
      throw new Error("사용자 정보를 찾을 수 없습니다. 다시 로그인해주세요.");
    }

    // 사용자가 이미 DB에 존재하는지 확인
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select("id, profile_completed")
      .eq("id", user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116은 "not found" 에러
      Sentry.captureException(fetchError, {
        tags: {
          error_type: "database_fetch_error",
          context: "profile_initialization"
        }
      });
      throw new Error("사용자 정보 조회 중 오류가 발생했습니다.");
    }

    if (!existingUser) {
      // 사용자가 DB에 없으면 먼저 생성
      const { error: insertError } = await supabase
        .from("users")
        .insert([
          {
            id: user.id,
            email: user.email || "",
            created_at: new Date().toISOString(),
            marketing: false,
            profile_completed: false,
          },
        ]);

      if (insertError) {
        Sentry.captureException(insertError, {
          tags: {
            error_type: "user_insert_error",
            context: "profile_initialization"
          }
        });
        throw new Error("사용자 계정 생성 중 오류가 발생했습니다.");
      }
    }

    // 프로필 업데이트
    const { error: updateError } = await supabase
      .from("users")
      .update({
        name,
        nickname,
        birthdate,
        gender,
        profile_completed: true,
        marketing,
      })
      .eq("id", user.id);
      
    if (updateError) {
      // 실제 에러 내용을 로그에 출력
      console.error("프로필 업데이트 실패 - 원본 에러:", updateError);
      console.error("에러 상세 정보:", {
        errorCode: updateError.code,
        errorMessage: updateError.message,
        errorDetails: updateError.details,
        errorHint: updateError.hint,
        userId: user.id,
        updateData: {
          name,
          nickname,
          birthdate,
          gender,
          profile_completed: true,
          marketing,
        }
      });
      
      Sentry.captureException(updateError, {
        tags: {
          error_type: "profile_update_error",
          context: "profile_initialization"
        },
        extra: {
          errorCode: updateError.code,
          errorMessage: updateError.message,
          errorDetails: updateError.details,
          errorHint: updateError.hint,
          userId: user.id,
        }
      });
      throw new Error("프로필 업데이트 중 오류가 발생했습니다.");
    }

    console.log("프로필 초기화 완료:", { userId: user.id, email: user.email });
    
  } catch (error) {
    // 모든 예외를 Sentry에 기록
    if (error instanceof Error) {
      Sentry.captureException(error, {
        tags: {
          error_type: "profile_initialization_error",
          context: "profile_initialization"
        }
      });
    }
    throw error;
  }
};
