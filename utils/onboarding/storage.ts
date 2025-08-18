"use client";

const ONBOARDING_STORAGE_KEY = "neo_onboarding_completed";

export const onboardingStorage = {
  /**
   * 온보딩 완료 상태를 확인합니다
   */
  isCompleted: (): boolean => {
    if (typeof window === "undefined") return false;
    
    try {
      const completed = localStorage.getItem(ONBOARDING_STORAGE_KEY);
      return completed === "true";
    } catch (error) {
      console.warn("로컬스토리지 접근 실패:", error);
      return false;
    }
  },

  /**
   * 온보딩 완료 상태를 저장합니다
   */
  markAsCompleted: (): void => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, "true");
    } catch (error) {
      console.warn("로컬스토리지 저장 실패:", error);
    }
  },

  /**
   * 온보딩 완료 상태를 초기화합니다 (개발/테스트 용도)
   */
  reset: (): void => {
    if (typeof window === "undefined") return;
    
    try {
      localStorage.removeItem(ONBOARDING_STORAGE_KEY);
    } catch (error) {
      console.warn("로컬스토리지 삭제 실패:", error);
    }
  }
};
