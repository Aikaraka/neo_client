"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// form action으로 사용할 수 있도록 FormData를 매개변수로 받고 void를 반환하도록 수정
export async function updateTopNovelViews() {
  const supabase = await createClient();

  try {
    // 일별 채팅 통계 초기화
    const { error: resetDailyError } = await supabase.rpc(
      "reset_daily_chat_stats"
    );

    if (resetDailyError) {
      console.error(
        "일별 채팅 통계 초기화 중 오류가 발생했습니다:",
        resetDailyError
      );
      return {
        success: false,
        message: "일별 채팅 통계 초기화 중 오류가 발생했습니다.",
      };
    }

    // 주간 통계 초기화 (매주 월요일에 실행)
    const today = new Date();
    if (today.getDay() === 1) {
      // 월요일인 경우
      const { error: resetWeeklyError } = await supabase.rpc(
        "reset_weekly_chat_stats"
      );

      if (resetWeeklyError) {
        console.error(
          "주별 채팅 통계 초기화 중 오류가 발생했습니다:",
          resetWeeklyError
        );
        return {
          success: false,
          message: "주별 채팅 통계 초기화 중 오류가 발생했습니다.",
        };
      }
    }

    // 월간 통계 초기화 (매월 1일에 실행)
    if (today.getDate() === 1) {
      // 1일인 경우
      const { error: resetMonthlyError } = await supabase.rpc(
        "reset_monthly_chat_stats"
      );

      if (resetMonthlyError) {
        console.error(
          "월별 채팅 통계 초기화 중 오류가 발생했습니다:",
          resetMonthlyError
        );
        return {
          success: false,
          message: "월별 채팅 통계 초기화 중 오류가 발생했습니다.",
        };
      }
    }

    return {
      success: true,
      message: "채팅 통계가 성공적으로 초기화되었습니다.",
    };
  } catch (error) {
    console.error("채팅 통계 초기화 중 오류가 발생했습니다:", error);
    return {
      success: false,
      message: "채팅 통계 초기화 중 오류가 발생했습니다.",
    };
  }
}

// 인기 소설 계산 및 저장 함수
export async function calculateAndSaveRankings(formData: FormData) {
  console.log("calculateAndSaveRankings 시작");
  const supabase = await createClient();
  console.log("supabase 클라이언트 생성 완료");

  // 소설 랭킹 타입 정의
  interface NovelRanking {
    novel_id: string;
    title: string;
    image_url: string | null;
    chat_count: number;
    rank: number;
  }

  // 현재 날짜 정보 가져오기 (한국 시간 기준)
  const now = new Date();
  const koreaTime = new Date(now.getTime() + 9 * 60 * 60 * 1000); // UTC에 9시간 추가

  const year = koreaTime.getFullYear();
  const month = koreaTime.getMonth() + 1; // 0-based
  const date = koreaTime.getDate();
  const day = koreaTime.getDay(); // 0: 일요일, 1: 월요일, ...

  // 주차 계산 (해당 월의 첫째 주부터 1주차로 계산)
  const weekOfMonth = Math.ceil(date / 7);

  // 기간 라벨 생성
  const dailyLabel = `${year}년 ${month}월 ${date}일`;
  const weeklyLabel = `${year}년 ${month}월 ${weekOfMonth}주차`;
  const monthlyLabel = `${year}년 ${month}월`;
  const allTimeLabel = "all_time";

  console.log("기간 라벨 생성 완료:", { dailyLabel, weeklyLabel, monthlyLabel, allTimeLabel });

  // 일별 인기 소설 계산
  console.log("일별 인기 소설 계산 시작");
  const { data: dailyTopNovels, error: dailyError } = await supabase.rpc(
    "get_daily_top_novels_by_chat",
    { top_count: 8 }
  );

  if (dailyError) {
    console.error("일별 인기 소설 계산 오류:", dailyError);
    throw new Error("일별 인기 소설 계산 중 오류가 발생했습니다.");
  }
  console.log("일별 인기 소설 계산 완료:", dailyTopNovels?.length, "개");

  // 주별 인기 소설 계산
  const { data: weeklyTopNovels, error: weeklyError } = await supabase.rpc(
    "get_weekly_top_novels_by_chat",
    { top_count: 8 }
  );

  if (weeklyError) {
    throw new Error("주별 인기 소설 계산 중 오류가 발생했습니다.");
  }

  // 월별 인기 소설 계산
  const { data: monthlyTopNovels, error: monthlyError } =
    await supabase.rpc("get_monthly_top_novels_by_chat", { top_count: 8 });

  if (monthlyError) {
    throw new Error("월별 인기 소설 계산 중 오류가 발생했습니다.");
  }

  // 전체 인기 소설 계산
  const { data: allTimeTopNovels, error: allTimeError } =
    await supabase.rpc("get_top_novels_by_chat", { top_count: 8 });

  if (allTimeError) {
    throw new Error("전체 인기 소설 계산 중 오류가 발생했습니다.");
  }

  // 기존 랭킹 삭제 (같은 기간 라벨의 랭킹)
  await supabase
    .from("novel_rankings")
    .delete()
    .eq("ranking_type", "daily")
    .eq("period_label", dailyLabel);

  await supabase
    .from("novel_rankings")
    .delete()
    .eq("ranking_type", "weekly")
    .eq("period_label", weeklyLabel);

  await supabase
    .from("novel_rankings")
    .delete()
    .eq("ranking_type", "monthly")
    .eq("period_label", monthlyLabel);

  await supabase
    .from("novel_rankings")
    .delete()
    .eq("ranking_type", "all_time")
    .eq("period_label", allTimeLabel);

  // 일별 랭킹 저장
  if (dailyTopNovels && dailyTopNovels.length > 0) {
    const dailyRankings = dailyTopNovels.map((novel: NovelRanking) => ({
      novel_id: novel.novel_id,
      title: novel.title,
      image_url: novel.image_url,
      chat_count: novel.chat_count,
      rank: novel.rank,
      ranking_type: "daily",
      period_label: dailyLabel,
      calculated_at: new Date().toISOString(),
    }));

    const { error: insertDailyError } = await supabase
      .from("novel_rankings")
      .insert(dailyRankings);

    if (insertDailyError) {
      console.log("?????", insertDailyError);
      throw new Error("일별 랭킹 저장 중 오류가 발생했습니다.");
    }
  }

  // 주별 랭킹 저장
  if (weeklyTopNovels && weeklyTopNovels.length > 0) {
    const weeklyRankings = weeklyTopNovels.map((novel: NovelRanking) => ({
      novel_id: novel.novel_id,
      title: novel.title,
      image_url: novel.image_url,
      chat_count: novel.chat_count,
      rank: novel.rank,
      ranking_type: "weekly",
      period_label: weeklyLabel,
      calculated_at: new Date().toISOString(),
    }));

    const { error: insertWeeklyError } = await supabase
      .from("novel_rankings")
      .insert(weeklyRankings);

    if (insertWeeklyError) {
      throw new Error("주별 랭킹 저장 중 오류가 발생했습니다.");
    }
  }

  // 월별 랭킹 저장
  if (monthlyTopNovels && monthlyTopNovels.length > 0) {
    const monthlyRankings = monthlyTopNovels.map((novel: NovelRanking) => ({
      novel_id: novel.novel_id,
      title: novel.title,
      image_url: novel.image_url,
      chat_count: novel.chat_count,
      rank: novel.rank,
      ranking_type: "monthly",
      period_label: monthlyLabel,
      calculated_at: new Date().toISOString(),
    }));

    const { error: insertMonthlyError } = await supabase
      .from("novel_rankings")
      .insert(monthlyRankings);

    if (insertMonthlyError) {
      throw new Error("월별 랭킹 저장 중 오류가 발생했습니다.");
    }
  }

  // 전체 랭킹 저장
  if (allTimeTopNovels && allTimeTopNovels.length > 0) {
    const allTimeRankings = allTimeTopNovels.map((novel: NovelRanking) => ({
      novel_id: novel.novel_id,
      title: novel.title,
      image_url: novel.image_url,
      chat_count: novel.chat_count,
      rank: novel.rank,
      ranking_type: "all_time",
      period_label: allTimeLabel,
      calculated_at: new Date().toISOString(),
    }));

    const { error: insertAllTimeError } = await supabase
      .from("novel_rankings")
      .insert(allTimeRankings);

    if (insertAllTimeError) {
      throw new Error("전체 랭킹 저장 중 오류가 발생했습니다.");
    }
  }

  // 캐시 무효화 (메인 페이지 갱신)
  revalidatePath("/");

  return {
    success: true,
    message: "인기 소설 랭킹이 성공적으로 계산되고 저장되었습니다.",
    dailyLabel,
    weeklyLabel,
    monthlyLabel,
    dailyCount: dailyTopNovels?.length || 0,
    weeklyCount: weeklyTopNovels?.length || 0,
    monthlyCount: monthlyTopNovels?.length || 0,
    allTimeCount: allTimeTopNovels?.length || 0,
  };
}
