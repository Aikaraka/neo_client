"use client";

import { useState } from "react";
import { calculateAndSaveRankings } from "@/app/admin/_api/admin.server";

interface AdminCalculateTopNovelsProps {
  onCalculationComplete: () => void;
}

export default function AdminCalculateTopNovels({ onCalculationComplete }: AdminCalculateTopNovelsProps) {
  const [result, setResult] = useState<{
    success: boolean;
    message: string;
    dailyLabel?: string;
    weeklyLabel?: string;
    monthlyLabel?: string;
    dailyCount?: number;
    weeklyCount?: number;
    monthlyCount?: number;
    allTimeCount?: number;
  } | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCalculate = async () => {
    console.log("[AdminCalculateTopNovels] 버튼 클릭됨");
    setIsProcessing(true);
    setResult(null);
    
    try {
      console.log("[AdminCalculateTopNovels] 서버 액션 호출 시작");
      const response = await calculateAndSaveRankings();
      console.log("[AdminCalculateTopNovels] 서버 액션 응답:", response);
      setResult(response);
      if (response.success) {
        onCalculationComplete();
      }
    } catch (error) {
      console.error("[AdminCalculateTopNovels] 서버 액션 에러:", error);
      setResult({
        success: false,
        message: `오류가 발생했습니다: ${error instanceof Error ? error.message : '알 수 없는 오류'}`,
      });
    } finally {
      setIsProcessing(false);
      console.log("[AdminCalculateTopNovels] 처리 완료");
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        인기 세계관 랭킹 계산 및 저장
      </h2>
      <p className="text-gray-600 mb-4">
        현재 채팅 통계를 기반으로 인기 세계관 랭킹을 계산하고 저장합니다. 이
        기능은 메인 페이지에 표시되는 인기 세계관 목록을 업데이트합니다.
      </p>

      <button
        onClick={handleCalculate}
        disabled={isProcessing}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400 mb-6"
      >
        {isProcessing ? "계산 중..." : "인기 세계관 랭킹 계산 및 저장"}
      </button>

      {isProcessing && (
        <div className="mt-4 p-3 bg-blue-100 rounded mb-4">
          <p className="text-blue-700">인기 세계관 랭킹을 계산하고 저장하고 있습니다. 잠시만 기다려주세요...</p>
        </div>
      )}

      {result && !isProcessing && (
        <div className="mt-4">
          <p
            className={`p-3 rounded ${
              result.success ? "bg-green-100" : "bg-red-100"
            } mb-4`}
          >
            <span className={result.success ? "text-green-700" : "text-red-700"}>
            {result.message}
            </span>
          </p>

          {result.success && result.dailyLabel && (
            <div className="grid grid-cols-1 gap-4">
              <div className="border rounded p-4">
                <h3 className="text-lg font-semibold mb-2">계산된 랭킹 정보</h3>
                <ul className="space-y-2">
                  <li>
                    <span className="font-medium">일별 랭킹:</span>{" "}
                    {result.dailyLabel} ({result.dailyCount}개)
                  </li>
                  <li>
                    <span className="font-medium">주별 랭킹:</span>{" "}
                    {result.weeklyLabel} ({result.weeklyCount}개)
                  </li>
                  <li>
                    <span className="font-medium">월별 랭킹:</span>{" "}
                    {result.monthlyLabel} ({result.monthlyCount}개)
                  </li>
                  <li>
                    <span className="font-medium">전체 랭킹:</span> (
                    {result.allTimeCount}개)
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
