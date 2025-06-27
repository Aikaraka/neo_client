"use client";

import { updateTopNovelViews } from "@/app/admin/_api/admin.server";
import { useState } from "react";

export default function AdminChatStats() {
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleResetStats = async () => {
    console.log("[AdminChatStats] 버튼 클릭됨");
    setIsProcessing(true);
    setResult(null);
    
    try {
      console.log("[AdminChatStats] 서버 액션 호출 시작");
      const response = await updateTopNovelViews();
      console.log("[AdminChatStats] 서버 액션 응답:", response);
      setResult(response);
    } catch (error) {
      console.error("[AdminChatStats] 서버 액션 에러:", error);
      setResult({
        success: false,
        message: `오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      });
    } finally {
      setIsProcessing(false);
      console.log("[AdminChatStats] 처리 완료");
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">채팅 통계 관리</h2>
      <p className="text-gray-600 mb-4">
        채팅 통계를 초기화합니다. 이 기능은 다음과 같은 작업을 수행합니다:
        <br />• 일별 채팅 통계: 매일 초기화됩니다.
        <br />• 주별 채팅 통계: 월요일에만 초기화됩니다.
        <br />• 월별 채팅 통계: 매월 1일에만 초기화됩니다.
      </p>

      <button
        onClick={handleResetStats}
        disabled={isProcessing}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {isProcessing ? "처리 중..." : "채팅 통계 초기화"}
      </button>

      {isProcessing && (
        <div className="mt-4 p-3 bg-blue-100 rounded">
          <p className="text-blue-700">채팅 통계를 초기화하고 있습니다. 잠시만 기다려주세요...</p>
        </div>
      )}

      {result && !isProcessing && (
        <div
          className={`mt-4 p-3 rounded ${
            result.success ? "bg-green-100" : "bg-red-100"
          }`}
        >
          <p className={result.success ? "text-green-700" : "text-red-700"}>
          {result.message}
          </p>
        </div>
      )}
    </>
  );
}
