import { Suspense } from "react";

import Footer from "@/components/layout/Footer";
import {
  getNovelsForGenreList,
  getNovelsByView,
  getRecommendedNovels,
} from "./_api/novelList.server";
import { HomeSkeleton } from "./_components/HomeSkeleton";
import { HomeClient } from "./_components/HomeClient";

// 동적 페이지로 설정: 보호 필터 상태가 사용자별로 다르므로 캐싱하지 않음
export const dynamic = "force-dynamic";

export default async function Home() {
  // safeFilter 파라미터를 전달하지 않으면, 각 함수가 자동으로 사용자의 보호 필터 상태를 확인합니다
  const [initialGenreNovels, initialRecommendedNovels, initialTopNovels] =
    await Promise.all([
      getNovelsForGenreList(),
      getRecommendedNovels(),
      getNovelsByView(),
    ]);
  return (
    <>
      <div className="flex w-full bg-background relative">
        <div className="flex-1 flex flex-col w-full">
          {/* Main Content */}
          <main className="flex-1 w-full flex justify-center">
            <Suspense fallback={<HomeSkeleton />}>
              <HomeClient
                initialGenreNovels={initialGenreNovels}
                initialRecommendedNovels={initialRecommendedNovels}
                initialTopNovels={initialTopNovels}
              />
            </Suspense>
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
