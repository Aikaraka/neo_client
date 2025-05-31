"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import Image from "next/image";

type RankingType = "daily" | "weekly" | "monthly" | "all_time";

// 소설 랭킹 타입 정의
interface NovelRanking {
  novel_id: string;
  title: string;
  image_url: string | null;
  chat_count: number;
  rank: number;
  period_label: string;
  calculated_at: string | null;
}

// 기간 라벨 타입
interface PeriodLabel {
  period_label: string;
}

export default function AdminViewRankings() {
  const [isLoading, setIsLoading] = useState(false);
  const [rankingType, setRankingType] = useState<RankingType>("daily");
  const [periods, setPeriods] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [rankings, setRankings] = useState<NovelRanking[]>([]);
  const [error, setError] = useState<string | null>(null);

  // 랭킹 타입이 변경되면 해당 타입의 기간 목록 가져오기
  useEffect(() => {
    const fetchPeriods = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();

        // 해당 랭킹 타입의 모든 기간 라벨 가져오기
        const { data, error } = await supabase
          .from("novel_rankings")
          .select("period_label")
          .eq("ranking_type", rankingType)
          .order("calculated_at", { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          // 중복 제거
          const periodLabels = data.map(
            (item: PeriodLabel) => item.period_label
          );
          const uniquePeriods = Array.from(new Set(periodLabels));
          setPeriods(uniquePeriods);
          setSelectedPeriod(uniquePeriods[0]); // 가장 최근 기간 선택
        } else {
          setPeriods([]);
          setSelectedPeriod("");
          setRankings([]);
        }
      } catch (err) {
        const error = err as Error;
        setError(error.message || "기간 목록을 가져오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPeriods();
  }, [rankingType]);

  // 선택된 기간이 변경되면 해당 기간의 랭킹 가져오기
  useEffect(() => {
    if (!selectedPeriod) return;

    const fetchRankings = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const supabase = createClient();

        // 직접 쿼리로 랭킹 가져오기
        const { data, error } = await supabase
          .from("novel_rankings")
          .select("*")
          .eq("ranking_type", rankingType)
          .eq("period_label", selectedPeriod)
          .order("rank", { ascending: true });

        if (error) {
          throw error;
        }

        setRankings(data || []);
      } catch (err) {
        const error = err as Error;
        setError(error.message || "랭킹을 가져오는 중 오류가 발생했습니다.");
        setRankings([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankings();
  }, [selectedPeriod, rankingType]);

  const getRankingTypeLabel = (type: RankingType) => {
    switch (type) {
      case "daily":
        return "일별";
      case "weekly":
        return "주별";
      case "monthly":
        return "월별";
      case "all_time":
        return "전체";
      default:
        return "";
    }
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">인기 소설 랭킹 조회</h2>
      <p className="text-gray-600 mb-4">저장된 인기 소설 랭킹을 조회합니다.</p>

      <div className="flex flex-wrap gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            랭킹 타입
          </label>
          <select
            value={rankingType}
            onChange={(e) => setRankingType(e.target.value as RankingType)}
            className="border rounded px-3 py-2 w-40"
            disabled={isLoading}
          >
            <option value="daily">일별 랭킹</option>
            <option value="weekly">주별 랭킹</option>
            <option value="monthly">월별 랭킹</option>
            <option value="all_time">전체 랭킹</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            기간
          </label>
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="border rounded px-3 py-2 w-64"
            disabled={isLoading || periods.length === 0}
          >
            {periods.length === 0 ? (
              <option value="">기간 없음</option>
            ) : (
              periods.map((period) => (
                <option key={period} value={period}>
                  {period}
                </option>
              ))
            )}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">로딩 중...</p>
        </div>
      ) : error ? (
        <div className="bg-red-100 p-4 rounded">
          <p className="text-red-700">{error}</p>
        </div>
      ) : rankings.length === 0 ? (
        <div className="bg-yellow-100 p-4 rounded">
          <p className="text-yellow-700">
            {selectedPeriod
              ? `${selectedPeriod} 기간의 ${getRankingTypeLabel(
                  rankingType
                )} 랭킹이 없습니다.`
              : `${getRankingTypeLabel(rankingType)} 랭킹이 없습니다.`}
          </p>
        </div>
      ) : (
        <div className="border rounded overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  순위
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  소설
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  채팅 수
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rankings.map((novel) => (
                <tr key={novel.novel_id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center justify-center bg-blue-500 text-white rounded-full w-6 h-6">
                      {novel.rank}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10 relative">
                        {novel.image_url ? (
                          <Image
                            src={novel.image_url}
                            alt={novel.title}
                            fill
                            className="object-cover rounded"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 rounded flex items-center justify-center">
                            <span className="text-xs text-gray-500">
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {novel.title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {novel.chat_count}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
