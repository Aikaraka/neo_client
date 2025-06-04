"use client";

import { useState } from "react";
import { calculateAndSaveRankings } from "@/app/admin/_api/admin.server";
import { useActionWithLoading } from "@/hooks/useActionWithLoading";

export default function AdminCalculateTopNovels() {
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

  const calculateAndSaveRankingsWithLoading = useActionWithLoading(calculateAndSaveRankings);

  const handleCalculate = async () => {
    try {
      const response = await calculateAndSaveRankingsWithLoading();
      setResult(response);
    } catch {
      setResult({
        success: false,
        message: "오류가 발생했습니다.",
      });
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        인기 소설 랭킹 계산 및 저장
      </h2>
      <p className="text-gray-600 mb-4">
        현재 채팅 통계를 기반으로 인기 소설 랭킹을 계산하고 저장합니다. 이
        기능은 메인 페이지에 표시되는 인기 소설 목록을 업데이트합니다.
      </p>

      <button
        onClick={handleCalculate}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-400 mb-6"
      >
        인기 소설 랭킹 계산 및 저장
      </button>

      {result && (
        <div className="mt-4">
          <p
            className={`p-3 rounded ${
              result.success ? "bg-green-100" : "bg-red-100"
            } mb-4`}
          >
            {result.message}
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
