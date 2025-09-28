import Image from "next/image";
import { Suspense } from "react";

import Footer from "@/components/layout/Footer";
import { MainBanner } from "@/app/_components/MainBanner";
import {
  getNovelsForGenreList,
  getNovelsByView,
  getRecommendedNovels,
} from "./_api/novelList.server";
import { HomeSkeleton } from "./_components/HomeSkeleton";
import { HomeClient } from "./_components/HomeClient";

// ISR 설정: 1일마다 재생성 (추천/인기 소설 업데이트 주기가 길어서)
export const revalidate = 86400; // 24시간 = 86400초

export default async function Home() {
  const [initialGenreNovels, initialRecommendedNovels, initialTopNovels] =
    await Promise.all([
      getNovelsForGenreList({ safeFilter: true }),
      getRecommendedNovels({ safeFilter: true }),
      getNovelsByView({ safeFilter: true }),
    ]);
  return (
    <>
      <div className="flex w-full bg-background relative">
        <div className="flex-1 flex flex-col">
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
