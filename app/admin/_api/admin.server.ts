"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { NovelForAdmin } from "@/types/novel";

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

    // 하루 전 날짜 계산
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

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
export async function calculateAndSaveRankings() {
  const supabase = await createClient();

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

  // 주차 계산 (해당 월의 첫째 주부터 1주차로 계산)
  const weekOfMonth = Math.ceil(date / 7);

  // 기간 라벨 생성
  const dailyLabel = `${year}년 ${month}월 ${date}일`;
  const weeklyLabel = `${year}년 ${month}월 ${weekOfMonth}주차`;
  const monthlyLabel = `${year}년 ${month}월`;
  const allTimeLabel = "all_time";

  // 일별 인기 소설 계산
  const { data: dailyTopNovels, error: dailyError } = await supabase.rpc(
    "get_daily_top_novels_by_chat",
    { top_count: 10 }
  );

  if (dailyError) {
    console.error("일별 인기 소설 계산 오류:", dailyError);
    throw new Error("일별 인기 소설 계산 중 오류가 발생했습니다.");
  }

  // 주별 인기 소설 계산
  const { data: weeklyTopNovels, error: weeklyError } = await supabase.rpc(
    "get_weekly_top_novels_by_chat",
    { top_count: 10 }
  );

  if (weeklyError) {
    throw new Error("주별 인기 소설 계산 중 오류가 발생했습니다.");
  }

  // 월별 인기 소설 계산
  const { data: monthlyTopNovels, error: monthlyError } = await supabase.rpc(
    "get_monthly_top_novels_by_chat",
    { top_count: 10 }
  );

  if (monthlyError) {
    throw new Error("월별 인기 소설 계산 중 오류가 발생했습니다.");
  }

  // 전체 인기 소설 계산
  const { data: allTimeTopNovels, error: allTimeError } = await supabase.rpc(
    "get_top_novels_by_chat",
    { top_count: 10 }
  );

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

// ====================================================================
// 콘텐츠 관리 (소설 목록)
// ====================================================================

interface GetNovelsParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
}

export async function getNovelsForAdmin(params: GetNovelsParams) {
  const { page = 1, limit = 10, searchTerm } = params;
  const supabase = await createClient();

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const query = supabase
    .from("novels")
    .select(
      `
      id,
      created_at,
      title,
      image_url,
      settings,
      users ( nickname ),
      novel_stats ( total_chats )
    `,
      { count: "exact" }
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (searchTerm) {
    // 제목과 작성자 모두 검색 (두 번의 쿼리로 처리)
    const titleQuery = supabase
      .from("novels")
      .select(
        `
        id,
        created_at,
        title,
        image_url,
        settings,
        users ( nickname ),
        novel_stats ( total_chats )
      `,
        { count: "exact" }
      )
      .ilike('title', `%${searchTerm}%`)
      .order("created_at", { ascending: false })
      .range(from, to);

    const authorQuery = supabase
      .from("novels")
      .select(
        `
        id,
        created_at,
        title,
        image_url,
        settings,
        users!inner ( nickname ),
        novel_stats ( total_chats )
      `,
        { count: "exact" }
      )
      .ilike('users.nickname', `%${searchTerm}%`)
      .order("created_at", { ascending: false })
      .range(from, to);

    // 두 쿼리를 병렬로 실행
    const [titleResult, authorResult] = await Promise.all([
      titleQuery,
      authorQuery
    ]);

    if (titleResult.error && authorResult.error) {
      console.error("Search errors:", { titleError: titleResult.error, authorError: authorResult.error });
      throw new Error("검색 중 오류가 발생했습니다.");
    }

    // 결과 합치기 (중복 제거)
    const titleData = titleResult.data || [];
    const authorData = authorResult.data || [];
    const combinedIds = new Set();
    const combinedData = [];

    // 제목 검색 결과 추가
    for (const item of titleData) {
      if (!combinedIds.has(item.id)) {
        combinedIds.add(item.id);
        combinedData.push(item);
      }
    }

    // 작성자 검색 결과 추가 (중복 제거)
    for (const item of authorData) {
      if (!combinedIds.has(item.id)) {
        combinedIds.add(item.id);
        combinedData.push(item);
      }
    }

    // 생성일순으로 정렬
    combinedData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const data = combinedData;
    const count = (titleResult.count || 0) + (authorResult.count || 0);
    
    // 데이터 구조를 사용하기 쉽게 가공
    const novels: NovelForAdmin[] = data.map((novel) => {
      const totalChats =
        Array.isArray(novel.novel_stats) && novel.novel_stats.length > 0
          ? novel.novel_stats[0].total_chats
          : 0;

      return {
        id: novel.id,
        created_at: novel.created_at,
        title: novel.title,
        image_url: novel.image_url,
        settings: novel.settings as { isPublic: boolean } | null,
        author_nickname: novel.users?.nickname || "알 수 없음",
        total_chats: totalChats || 0,
      };
    });

    const totalCount = count || 0;

    return {
      novels,
      count: totalCount,
    };
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("Error fetching novels for admin:", error);
    throw new Error("소설 목록을 가져오는 중 오류가 발생했습니다.");
  }
  
  // 데이터 구조를 사용하기 쉽게 가공
  const novels: NovelForAdmin[] = data.map((novel) => {
    const totalChats =
      Array.isArray(novel.novel_stats) && novel.novel_stats.length > 0
        ? novel.novel_stats[0].total_chats
        : 0;

    return {
      id: novel.id,
      created_at: novel.created_at,
      title: novel.title,
      image_url: novel.image_url,
      settings: novel.settings as { isPublic: boolean } | null,
      author_nickname: novel.users?.nickname || "알 수 없음",
      total_chats: totalChats || 0,
    };
  });

  const totalCount = count || 0;

  return {
    novels,
    count: totalCount,
  };
}

export async function getNovelDetailsForAdmin(novelId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('novels')
    .select(
      `
      title,
      background,
      plot,
      characters
    `
    )
    .eq('id', novelId)
    .single();

  if (error) {
    console.error('Error fetching novel details for admin:', error);
    throw new Error('소설 상세 정보를 가져오는 데 실패했습니다.');
  }

  // characters는 jsonb 배열일 수 있으므로 그대로 반환
  return data;
}

// 어드민 전용 소설 삭제 함수
export async function deleteNovelAsAdmin(novelId: string) {
  console.log(`[deleteNovelAsAdmin] 삭제 시작: novelId=${novelId}`);
  const supabase = await createClient();

  try {
    // 현재 사용자 정보 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    console.log(`[deleteNovelAsAdmin] 현재 사용자: ${user?.id}, 이메일: ${user?.email}`);
    if (authError) {
      console.error(`[deleteNovelAsAdmin] 인증 오류:`, authError);
      throw new Error(`인증 오류: ${authError.message}`);
    }

    // 먼저 관련된 데이터들을 삭제해야 합니다 (외래 키 제약 때문에)
    
    // 1. novel_stats 삭제
    console.log(`[deleteNovelAsAdmin] novel_stats 삭제 시도`);
    const statsResponse = await supabase
      .from("novel_stats")
      .delete()
      .eq("novel_id", novelId);

    console.log(`[deleteNovelAsAdmin] novel_stats 삭제 응답:`, {
      data: statsResponse.data,
      error: statsResponse.error,
      status: statsResponse.status,
      statusText: statsResponse.statusText
    });

    // 2. novel_rankings 삭제
    console.log(`[deleteNovelAsAdmin] novel_rankings 삭제 시도`);
    const rankingsResponse = await supabase
      .from("novel_rankings")
      .delete()
      .eq("novel_id", novelId);

    console.log(`[deleteNovelAsAdmin] novel_rankings 삭제 응답:`, {
      data: rankingsResponse.data,
      error: rankingsResponse.error,
      status: rankingsResponse.status,
      statusText: rankingsResponse.statusText
    });

    // 3. 삭제 전에 소설이 존재하는지 확인
    console.log(`[deleteNovelAsAdmin] 삭제할 소설 확인 중`);
    const { data: novelToDelete, error: checkError } = await supabase
      .from("novels")
      .select("id, title, user_id")
      .eq("id", novelId)
      .single();

    if (checkError || !novelToDelete) {
      console.error(`[deleteNovelAsAdmin] 소설을 찾을 수 없음:`, checkError);
      throw new Error(`소설을 찾을 수 없습니다: ${novelId}`);
    }
    console.log(`[deleteNovelAsAdmin] 삭제할 소설 찾음:`, novelToDelete);

    // 4. 마지막으로 소설 자체를 삭제
    console.log(`[deleteNovelAsAdmin] novels 테이블에서 삭제 시도`);
    const deleteResponse = await supabase
      .from("novels")
      .delete()
      .eq("id", novelId);

    console.log(`[deleteNovelAsAdmin] novels 삭제 응답:`, {
      data: deleteResponse.data,
      error: deleteResponse.error,
      status: deleteResponse.status,
      statusText: deleteResponse.statusText,
      count: deleteResponse.count
    });

    if (deleteResponse.error) {
      console.error("[deleteNovelAsAdmin] Novel deletion error 상세:", {
        message: deleteResponse.error.message,
        details: deleteResponse.error.details,
        hint: deleteResponse.error.hint,
        code: deleteResponse.error.code
      });
      throw new Error(`소설 삭제 중 오류가 발생했습니다: ${deleteResponse.error.message}`);
    }

    // 5. 관련 페이지 캐시 무효화
    console.log(`[deleteNovelAsAdmin] 캐시 무효화 중`);
    revalidatePath("/admin/novels");
    revalidatePath("/");

    console.log(`[deleteNovelAsAdmin] 모든 작업 완료`);
    return { success: true, message: "소설이 성공적으로 삭제되었습니다." };
  } catch (error) {
    console.error("[deleteNovelAsAdmin] Unexpected error:", error);
    throw error;
  }
}
