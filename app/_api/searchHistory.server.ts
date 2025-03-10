"use server";

import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

/**
 * 검색어 저장 함수
 * @param searchTerm 검색어
 */
export async function saveSearchTerm(searchTerm: string) {
  if (!searchTerm || searchTerm.trim() === '') return;
  
  // 쿠키에서 세션 정보 가져오기
  const cookieStore = cookies();
  const supabase = await createClient();
  
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("검색어 저장을 위해서는 로그인이 필요합니다.");
      return; // 로그인하지 않은 경우 저장하지 않음
    }
    
    console.log("검색어 저장 시도:", searchTerm, "사용자 ID:", user.id);
    
    // 이미 존재하는 검색어인 경우 created_at만 업데이트
    const { error } = await supabase
      .from('search_history')
      .upsert({
        user_id: user.id,
        search_term: searchTerm.trim(),
        created_at: new Date().toISOString()
      }, {
        onConflict: 'user_id,search_term'
      });
    
    if (error) {
      console.error("검색어 저장 중 오류가 발생했습니다:", error);
    } else {
      console.log("검색어가 성공적으로 저장되었습니다:", searchTerm);
    }
  } catch (e) {
    console.error("검색어 저장 중 예외가 발생했습니다:", e);
  }
}

/**
 * 최근 검색어 조회 함수
 * @param limit 조회할 검색어 수
 * @returns 최근 검색어 목록
 */
export async function getRecentSearchTerms(limit = 5) {
  // 쿠키에서 세션 정보 가져오기
  const cookieStore = cookies();
  const supabase = await createClient();
  
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("최근 검색어 조회를 위해서는 로그인이 필요합니다.");
      return []; // 로그인하지 않은 경우 빈 배열 반환
    }
    
    console.log("최근 검색어 조회 시도, 사용자 ID:", user.id);
    
    // 최근 검색어 조회
    const { data, error } = await supabase
      .from('search_history')
      .select('search_term, created_at')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error("최근 검색어 조회 중 오류가 발생했습니다:", error);
      return [];
    }
    
    console.log("최근 검색어 조회 결과:", data?.length || 0, "개 항목");
    return data || [];
  } catch (e) {
    console.error("최근 검색어 조회 중 예외가 발생했습니다:", e);
    return [];
  }
}

/**
 * 검색어 삭제 함수
 * @param searchTerm 삭제할 검색어
 */
export async function deleteSearchTerm(searchTerm: string) {
  if (!searchTerm) return;
  
  // 쿠키에서 세션 정보 가져오기
  const cookieStore = cookies();
  const supabase = await createClient();
  
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("검색어 삭제를 위해서는 로그인이 필요합니다.");
      return; // 로그인하지 않은 경우 삭제하지 않음
    }
    
    console.log("검색어 삭제 시도:", searchTerm, "사용자 ID:", user.id);
    
    // 검색어 삭제
    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('user_id', user.id)
      .eq('search_term', searchTerm);
    
    if (error) {
      console.error("검색어 삭제 중 오류가 발생했습니다:", error);
    } else {
      console.log("검색어가 성공적으로 삭제되었습니다:", searchTerm);
    }
  } catch (e) {
    console.error("검색어 삭제 중 예외가 발생했습니다:", e);
  }
}

/**
 * 모든 검색어 삭제 함수
 */
export async function clearAllSearchTerms() {
  // 쿠키에서 세션 정보 가져오기
  const cookieStore = cookies();
  const supabase = await createClient();
  
  try {
    // 현재 로그인한 사용자 정보 가져오기
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log("검색어 삭제를 위해서는 로그인이 필요합니다.");
      return; // 로그인하지 않은 경우 삭제하지 않음
    }
    
    console.log("모든 검색어 삭제 시도, 사용자 ID:", user.id);
    
    // 모든 검색어 삭제
    const { error } = await supabase
      .from('search_history')
      .delete()
      .eq('user_id', user.id);
    
    if (error) {
      console.error("모든 검색어 삭제 중 오류가 발생했습니다:", error);
    } else {
      console.log("모든 검색어가 성공적으로 삭제되었습니다.");
    }
  } catch (e) {
    console.error("모든 검색어 삭제 중 예외가 발생했습니다:", e);
  }
} 