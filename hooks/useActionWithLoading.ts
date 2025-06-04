"use client";

import { useLoading } from "@/contexts/LoadingContext"; // 생성한 LoadingContext 경로
import { useCallback } from "react";

// 서버 액션의 일반적인 형태를 제네릭으로 정의합니다.
// Args: 서버 액션이 받는 파라미터들의 배열 타입
// Response: 서버 액션이 반환하는 프로미스의 결과 타입
type ServerAction<Args extends any[], Response> = (
  ...args: Args
) => Promise<Response>;

export function useActionWithLoading<Args extends any[], Response>(
  action: ServerAction<Args, Response>
): (...args: Args) => Promise<Response> {
  const { showLoading, hideLoading } = useLoading();

  const wrappedAction = useCallback(
    async (...args: Args): Promise<Response> => {
      showLoading(); // 액션 시작 전 로딩 표시
      try {
        const result = await action(...args); // 실제 서버 액션 실행
        return result;
      } catch (error) {
        // 오류 발생 시 콘솔에 기록 (Sentry 등의 오류 로깅 서비스와 통합 가능)
        console.error("Server action failed:", error);
        throw error; // 에러를 다시 throw하여 호출부에서 개별적으로 처리할 수 있도록 함
      } finally {
        hideLoading(); // 액션 완료 또는 실패 시 로딩 숨김
      }
    },
    [action, showLoading, hideLoading] // 의존성 배열: action이나 로딩 함수가 변경될 때만 함수 재생성
  );

  return wrappedAction;
} 