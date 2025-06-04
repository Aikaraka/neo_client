"use client";

import { useLoading } from "@/contexts/LoadingContext"; // 생성한 Context 경로
import React, { useState, useEffect } from "react";

const Spinner = () => (
  <svg
    className="animate-spin h-10 w-10 text-primary" // 프로젝트의 테마 색상(primary) 사용 가정
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export const GlobalLoadingIndicator = () => {
  const { isLoading } = useLoading();
  const [shouldShow, setShouldShow] = useState(false);
  const [minimumDurationMet, setMinimumDurationMet] = useState(true);

  useEffect(() => {
    let showTimeoutId: NodeJS.Timeout;
    let hideTimeoutId: NodeJS.Timeout;
    
    if (isLoading && !shouldShow) {
      // 300ms 지연 후 로딩 표시 (짧은 작업은 로딩 표시 안 함)
      showTimeoutId = setTimeout(() => {
        setShouldShow(true);
        setMinimumDurationMet(false);
        
        // 최소 표시 시간 타이머 시작 (500ms)
        hideTimeoutId = setTimeout(() => {
          setMinimumDurationMet(true);
        }, 500);
      }, 300);
    } else if (!isLoading && shouldShow && minimumDurationMet) {
      // 로딩이 끝났고 최소 시간도 지났으면 숨기기
      setShouldShow(false);
    }
    
    return () => {
      clearTimeout(showTimeoutId);
      clearTimeout(hideTimeoutId);
    };
  }, [isLoading, shouldShow, minimumDurationMet]);

  if (!shouldShow) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-[9999]" // 높은 z-index 값
      aria-live="assertive"
      aria-busy={true}
      aria-label="Loading content" // 접근성을 위한 레이블
    >
      <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col items-center gap-3">
        <Spinner />
        <p className="text-sm text-muted-foreground">잠시만 기다려주세요...</p>
      </div>
    </div>
  );
}; 