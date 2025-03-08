"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// 관리자 전용 Supabase 클라이언트 생성 (RLS 우회)
function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// form action으로 사용할 수 있도록 FormData를 매개변수로 받고 void를 반환하도록 수정
export async function updateTopNovelViews(formData: FormData) {
  // 일반 클라이언트 (사용자 확인용)
  const supabase = await createClient();
  
  // 관리자 권한 확인
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error("사용자 인증 오류:", userError);
    throw new Error("인증된 사용자가 아닙니다.");
  }
  
  // 관리자 클라이언트 (RLS 우회)
  const supabaseAdmin = createAdminClient();
  
  try {
    // 오늘 날짜 계산
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // 어제 날짜 계산
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];
    
    console.log(`오늘(${todayStr})의 인기 소설을 계산합니다.`);
    console.log(`어제(${yesterdayStr})의 조회 데이터를 기준으로 합니다.`);
    
    // 1. 기존 오늘 데이터 삭제 (관리자 클라이언트 사용)
    await supabaseAdmin
      .from('top_novel_views')
      .delete()
      .eq('calculated_date', todayStr);
    
    // 2. novel_views 테이블에서 어제 하루 동안의 조회 데이터 가져오기 (관리자 클라이언트 사용)
    const { data: viewsData, error: viewsError } = await supabaseAdmin
      .from('novel_views')
      .select('novel_id, last_viewed_at')
      .gte('last_viewed_at', `${yesterdayStr}T00:00:00`)
      .lt('last_viewed_at', `${todayStr}T00:00:00`);
    
    if (viewsError) {
      console.error("조회수 정보를 가져오던 중 오류가 발생했습니다:", viewsError);
      throw new Error("조회수 정보를 가져오던 중 오류가 발생했습니다.");
    }
    
    console.log(`어제의 조회 데이터 ${viewsData?.length || 0}건을 가져왔습니다.`);
    
    // 3. 각 소설별 조회수 계산
    const novelViewCounts: Record<string, number> = {};
    
    viewsData?.forEach((view: any) => {
      const novelId = view.novel_id;
      if (!novelViewCounts[novelId]) {
        novelViewCounts[novelId] = 0;
      }
      novelViewCounts[novelId] += 1;
    });
    
    // 4. 조회수 기준으로 상위 8개 소설 ID 추출
    const topNovels = Object.entries(novelViewCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 8);
    
    console.log(`상위 ${topNovels.length}개 소설을 추출했습니다.`);
    
    if (topNovels.length === 0) {
      console.error("어제의 조회 데이터가 없습니다.");
      return;
    }
    
    // 5. 소설 ID 목록
    const novelIds = topNovels.map(([novelId]) => novelId);
    
    // 6. 소설 정보 가져오기 (관리자 클라이언트 사용)
    const { data: novelsData, error: novelsError } = await supabaseAdmin
      .from('novels')
      .select('*')
      .in('id', novelIds);
    
    if (novelsError) {
      console.error("소설 정보를 가져오던 중 오류가 발생했습니다:", novelsError);
      throw new Error("소설 정보를 가져오던 중 오류가 발생했습니다.");
    }
    
    // 7. top_novel_views 테이블에 데이터 삽입 (관리자 클라이언트 사용)
    const topNovelViewsData = topNovels.map(([novelId, count], index) => {
      const novel = novelsData?.find((n: any) => n.id === novelId);
      return {
        novel_id: novelId,
        title: novel?.title || '',
        image_url: novel?.image_url || '',
        view_count: count,
        calculated_date: todayStr,
        rank: index + 1
      };
    });
    
    const { error: insertError } = await supabaseAdmin
      .from('top_novel_views')
      .insert(topNovelViewsData);
    
    if (insertError) {
      console.error("인기 소설 데이터 저장 중 오류가 발생했습니다:", insertError);
      throw new Error("인기 소설 데이터 저장 중 오류가 발생했습니다.");
    }
    
    // 캐시 무효화
    revalidatePath('/');
    
    console.log(`${topNovelViewsData.length}개의 인기 소설 목록이 업데이트되었습니다.`);
  } catch (error: any) {
    console.error("인기 소설 목록 업데이트 중 오류 발생:", error);
    throw error; // 오류를 다시 던져서 UI에 표시될 수 있도록 함
  }
} 