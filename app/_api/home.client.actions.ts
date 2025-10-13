"use server";

import {
  getNovelsForGenreList,
  getRecommendedNovels,
  getNovelsByView,
} from "./novelList.server";

/**
 * 사용자의 보호 필터 설정에 따라 홈 페이지 리스트를 가져옵니다.
 * 각 함수가 자동으로 사용자의 보호 필터 상태를 확인하므로,
 * safeFilter 파라미터를 전달하지 않습니다.
 */
export async function getPersonalizedHomeLists() {
  const [genre, recommended, top] = await Promise.all([
    getNovelsForGenreList(),
    getRecommendedNovels(),
    getNovelsByView(),
  ]);

  return { genre, recommended, top };
}
