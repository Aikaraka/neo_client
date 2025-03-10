"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * 소설 검색 함수
 * @param searchTerm 검색어
 * @param filters 필터 옵션 (연령대, 성별 등)
 * @param page 페이지 번호 (1부터 시작)
 * @param pageSize 페이지당 항목 수
 * @param sortBy 정렬 방식 ('relevance', 'latest', 'views')
 * @param genre 장르 필터링
 * @returns 검색 결과 및 메타데이터
 */
export async function searchNovels({
  searchTerm,
  filters = {},
  page = 1,
  pageSize = 10,
  sortBy = 'relevance',
  genre = []
}: {
  searchTerm: string;
  filters?: {
    ageGroup?: string; // '10대 여성', '20대 남성' 등
    gender?: string;   // '여성', '남성'
    genre?: string;    // '판타지', '로맨스' 등
  };
  page?: number;
  pageSize?: number;
  sortBy?: 'relevance' | 'latest' | 'views';
  genre?: string[] | string; // 장르 필터링 (단일 문자열 또는 문자열 배열)
}) {
  const supabase = await createClient();
  
  // 장르 파라미터 처리
  let genres: string[] = [];
  
  try {
    // 이미 배열인 경우
    if (Array.isArray(genre)) {
      genres = genre.filter(g => g && g.trim() !== '' && g !== 'all');
    } 
    // 문자열인 경우
    else if (typeof genre === 'string') {
      if (genre.includes(',')) {
        // 쉼표로 구분된 문자열인 경우
        genres = genre.split(',').filter(g => g && g.trim() !== '' && g !== 'all');
      } else if (genre && genre.trim() !== '' && genre !== 'all') {
        // 단일 문자열인 경우
        genres = [genre.trim()];
      }
    }
    
    // 디버깅용 로그
    console.log('검색 요청 정보:', {
      searchTerm,
      sortBy,
      장르: genres,
      장르타입: typeof genre,
      원본장르: genre
    });
  } catch (error) {
    console.error('장르 파라미터 처리 중 오류 발생:', error);
    // 오류 발생 시 빈 배열로 초기화
    genres = [];
  }
  
  try {
    // 검색어가 없는 경우 빈 결과 반환
    if (!searchTerm || searchTerm.trim() === '') {
      return {
        novels: [],
        metadata: {
          totalCount: 0,
          page,
          pageSize,
          totalPages: 0
        }
      };
    }

    const trimmedSearchTerm = searchTerm.trim();
    
    // 정렬 방식에 따라 다른 검색 로직 적용
    switch (sortBy) {
      case 'latest':
        // 최신순 정렬: 생성일 기준 내림차순
        return await searchByLatest(supabase, trimmedSearchTerm, page, pageSize, genres);
        
      case 'views':
        // 조회수순 정렬: 조회수 기준 내림차순
        return await searchByViews(supabase, trimmedSearchTerm, page, pageSize, genres);
        
      case 'relevance':
      default:
        // 정확도순 정렬: 제목 검색 결과 먼저, 그 다음 내용 검색 결과
        return await searchByRelevance(supabase, trimmedSearchTerm, page, pageSize, genres);
    }
  } catch (e) {
    console.error("소설 검색 중 예외가 발생했습니다:", e);
    return {
      novels: [],
      metadata: {
        totalCount: 0,
        page,
        pageSize,
        totalPages: 0
      }
    };
  }
}

/**
 * 정확도순 검색 (제목 검색 결과 먼저, 그 다음 내용 검색 결과)
 */
async function searchByRelevance(supabase: any, searchTerm: string, page: number, pageSize: number, genre: string[]) {
  // 1. 제목에서 검색
  let titleQuery = supabase
    .from("novels")
    .select("*")
    .filter('settings->isPublic', 'eq', true)
    .ilike('title', `%${searchTerm}%`)
    .order("created_at", { ascending: false });
  
  // 장르 필터링 적용
  if (genre.length > 0) {
    titleQuery = titleQuery.contains('mood', genre);
  }
  
  const { data: titleResults, error: titleError } = await titleQuery;
  
  if (titleError) {
    console.error("제목 검색 중 오류가 발생했습니다:", titleError);
    throw new Error("소설 검색 중 오류가 발생했습니다.");
  }
  
  // 제목 검색 결과의 ID 목록
  const titleResultIds = titleResults ? titleResults.map((novel: any) => novel.id) : [];
  
  // 2. 내용(plot)에서 검색 (제목 검색 결과 제외)
  let plotQuery = supabase
    .from("novels")
    .select("*")
    .filter('settings->isPublic', 'eq', true)
    .ilike('plot', `%${searchTerm}%`)
    .order("created_at", { ascending: false });
  
  // 장르 필터링 적용
  if (genre.length > 0) {
    plotQuery = plotQuery.contains('mood', genre);
  }
  
  // 제목 검색 결과가 있는 경우, 해당 ID를 제외
  if (titleResultIds.length > 0) {
    plotQuery = plotQuery.not('id', 'in', `(${titleResultIds.join(',')})`);
  }
  
  const { data: plotResults, error: plotError } = await plotQuery;
  
  if (plotError) {
    console.error("내용 검색 중 오류가 발생했습니다:", plotError);
    throw new Error("소설 검색 중 오류가 발생했습니다.");
  }
  
  // 제목 검색 결과와 내용 검색 결과 합치기
  const allResults = [...(titleResults || []), ...(plotResults || [])];
  
  // 페이지네이션 적용
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, allResults.length);
  const paginatedResults = allResults.slice(startIndex, endIndex);
  
  // 총 검색 결과 수
  const totalCount = allResults.length;
  
  // 페이지네이션 계산
  const totalPages = Math.ceil(totalCount / pageSize);
  
  return {
    novels: paginatedResults,
    metadata: {
      totalCount,
      page,
      pageSize,
      totalPages
    }
  };
}

/**
 * 최신순 검색 (생성일 기준 내림차순)
 */
async function searchByLatest(supabase: any, searchTerm: string, page: number, pageSize: number, genre: string[]) {
  // 시작 인덱스와 종료 인덱스 계산
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize - 1;
  
  // 제목 또는 내용에 검색어가 포함된 소설을 생성일 기준 내림차순으로 검색
  let query = supabase
    .from("novels")
    .select("*", { count: "exact" })
    .filter('settings->isPublic', 'eq', true)
    .or(`title.ilike.%${searchTerm}%,plot.ilike.%${searchTerm}%`)
    .order("created_at", { ascending: false });
  
  // 장르 필터링 적용
  if (genre.length > 0) {
    query = query.contains('mood', genre);
  }
  
  // 페이지네이션 적용
  query = query.range(startIndex, endIndex);
  
  const { data, error, count } = await query;
  
  if (error) {
    console.error("최신순 검색 중 오류가 발생했습니다:", error);
    throw new Error("소설 검색 중 오류가 발생했습니다.");
  }
  
  return {
    novels: data || [],
    metadata: {
      totalCount: count || 0,
      page,
      pageSize,
      totalPages: count ? Math.ceil(count / pageSize) : 0
    }
  };
}

/**
 * 조회수순 검색 (조회수 기준 내림차순)
 */
async function searchByViews(supabase: any, searchTerm: string, page: number, pageSize: number, genre: string[]) {
  // 시작 인덱스와 종료 인덱스 계산
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize - 1;
  
  try {
    // 제목 또는 내용에 검색어가 포함된 소설의 ID 목록 가져오기
    let novelQuery = supabase
      .from("novels")
      .select("id")
      .filter('settings->isPublic', 'eq', true)
      .or(`title.ilike.%${searchTerm}%,plot.ilike.%${searchTerm}%`);
    
    // 장르 필터링 적용
    if (genre.length > 0) {
      novelQuery = novelQuery.contains('mood', genre);
    }
    
    const { data: novelIds, error: searchError } = await novelQuery;
    
    if (searchError) {
      console.error("소설 ID 검색 중 오류가 발생했습니다:", searchError);
      throw new Error("소설 검색 중 오류가 발생했습니다.");
    }
    
    if (!novelIds || novelIds.length === 0) {
      return {
        novels: [],
        metadata: {
          totalCount: 0,
          page,
          pageSize,
          totalPages: 0
        }
      };
    }
    
    // 소설 ID 목록
    const ids = novelIds.map((novel: any) => novel.id);
    
    // 채팅 수 계산을 위한 직접 쿼리 (RPC 대신)
    const { data: chatStats, error: chatStatsError } = await supabase
      .from('novel_stats')
      .select('novel_id, total_chats')
      .in('novel_id', ids)
      .order('total_chats', { ascending: false });
    
    if (chatStatsError) {
      console.error("채팅 통계 조회 중 오류가 발생했습니다:", chatStatsError);
      // 채팅 통계 조회에 실패한 경우 최신순으로 대체
      return await searchByLatest(supabase, searchTerm, page, pageSize, genre);
    }
    
    // 채팅 수 기준으로 정렬된 소설 ID 목록
    const sortedIds = chatStats.map((item: any) => item.novel_id);
    
    // 통계가 없는 소설들도 포함 (채팅 수 0으로 간주)
    const missingIds = ids.filter((id: string) => !sortedIds.includes(id));
    const allSortedIds = [...sortedIds, ...missingIds];
    
    // 정렬된 ID 목록에 따라 소설 정보 가져오기
    const novels: any[] = [];
    
    // 페이지네이션 적용
    const paginatedIds = allSortedIds.slice(startIndex, endIndex + 1);
    
    // 각 ID에 해당하는 소설 정보 가져오기
    for (const id of paginatedIds) {
      const { data: novel, error: novelError } = await supabase
        .from("novels")
        .select("*")
        .eq("id", id)
        .single();
      
      if (!novelError && novel) {
        novels.push(novel);
      }
    }
    
    return {
      novels,
      metadata: {
        totalCount: allSortedIds.length,
        page,
        pageSize,
        totalPages: Math.ceil(allSortedIds.length / pageSize)
      }
    };
  } catch (e) {
    console.error("소설 검색 중 예외가 발생했습니다:", e);
    return {
      novels: [],
      metadata: {
        totalCount: 0,
        page,
        pageSize,
        totalPages: 0
      }
    };
  }
}

/**
 * 인기 검색어 가져오기
 * @param limit 가져올 인기 검색어 수
 * @returns 인기 검색어 목록
 */
export async function getPopularSearchTerms(limit = 10) {
  const supabase = await createClient();
  
  try {
    // Supabase에 popular_search_terms 뷰가 있는지 확인
    // 타입 오류를 피하기 위해 any 타입 사용
    const { data, error } = await (supabase as any)
      .from('popular_search_terms')
      .select('search_term, search_count')
      .limit(limit);
    
    if (error) {
      console.error("인기 검색어를 가져오는 중 오류가 발생했습니다:", error);
      // 오류 발생 시 기본 데이터 반환
      return getDefaultPopularTerms(limit);
    }
    
    if (!data || data.length === 0) {
      return getDefaultPopularTerms(limit);
    }
    
    // 데이터 형식이 예상과 다를 수 있으므로 안전하게 처리
    return data.map((item: any) => item.search_term || '');
  } catch (e) {
    console.error("인기 검색어를 가져오는 중 예외가 발생했습니다:", e);
    return getDefaultPopularTerms(limit);
  }
}

/**
 * 기본 인기 검색어 목록 반환 (뷰가 없거나 오류 발생 시 사용)
 */
function getDefaultPopularTerms(limit = 10) {
  return [
    "마법학교 아르피아",
    "일진",
    "판타지",
    "중세시대",
    "로맨스",
    "대공",
    "추리",
    "로맨스판타지",
    "현대판타지",
    "중세"
  ].slice(0, limit);
}

/**
 * 검색어 로그 저장
 * @param searchTerm 검색어
 * @param userId 사용자 ID (선택적)
 */
export async function logSearchTerm(searchTerm: string, userId?: string) {
  if (!searchTerm || searchTerm.trim() === '') return;
  
  const supabase = await createClient();
  
  try {
    // 타입 오류를 피하기 위해 any 타입 사용
    const { error } = await (supabase as any)
      .from('search_logs')
      .insert({
        search_term: searchTerm.trim(),
        user_id: userId || null
      });
    
    if (error && error.code !== '42P01') { // 테이블이 없는 경우 무시
      console.error("검색어 로그 저장 중 오류가 발생했습니다:", error);
    }
  } catch (e) {
    console.error("검색어 로그 저장 중 예외가 발생했습니다:", e);
  }
} 