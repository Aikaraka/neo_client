import Image from "next/image";
import {
  NovelListByGenreCarousel,
  RecommendedNovelListCarousel,
  TopNovelListCarousel,
  RecommendedNovelList,
  TopNovelList,
  NovelListByGenre,
} from "@/app/_components/NovelList";
import { Toaster } from "@/components/ui/toaster";
import MainHeader from "@/app/_components/MainHeader";
import Footer from "@/components/layout/Footer";
import HomePageClient from "@/app/_components/HomePageClient";

export default async function Home() {
  return (
    <>
      <Toaster />
      <HomePageClient>
        <div
          className="flex w-full bg-background relative"
          style={{ height: "111.11vh" }}
        >
          <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hidden">
            {/* Header */}
            <MainHeader />

            {/* Main Content */}
            <main className="flex-1 w-full flex justify-center">
              <div className="w-full max-w-[1160px] relative p-4">
                {/* Genres Section */}
                <section className="relative">
                  <h2 className="text-[22px] font-semibold mb-4 flex items-center">
                    <Image
                      src="/novel/genre_badge.svg"
                      alt="icon"
                      width={20}
                      height={20}
                      className="h-5 md:h-6 w-auto mr-2"
                    />
                    장르별 소설 추천
                  </h2>
                  <div className="relative overflow-visible">
                    {/* 모바일에서는 NovelList, 데스크톱에서는 Carousel */}
                    <div className="block md:hidden">
                      <NovelListByGenre />
                    </div>
                    <div className="hidden md:block">
                      <NovelListByGenreCarousel />
                    </div>
                  </div>
                </section>

                {/* Recommended Section */}
                <section className="relative pt-20">
                  <h2 className="text-[22px] font-semibold flex items-center">
                    <Image
                      src="/novel/recommend_badge.svg"
                      alt="icon"
                      width={20}
                      height={20}
                      className="h-5 md:h-6 w-auto mr-2"
                    />
                    당신을 위한 맞춤 추천
                  </h2>
                  <div className="relative overflow-visible">
                    {/* 모바일에서는 NovelList, 데스크톱에서는 Carousel */}
                    <div className="block md:hidden">
                      <RecommendedNovelList />
                    </div>
                    <div className="hidden md:block">
                      <RecommendedNovelListCarousel />
                    </div>
                  </div>
                </section>

                {/* Top 5 Section */}
                <section className="relative pt-20 pb-10">
                  <h2 className="text-[22px] font-semibold flex items-center">
                    <Image
                      src="/novel/top_badge.svg"
                      alt="icon"
                      width={20}
                      height={20}
                      className="h-5 md:h-6 w-auto mr-2"
                    />
                    실시간 TOP 5 소설
                  </h2>
                  <div className="relative overflow-visible">
                    {/* 모바일에서는 NovelList, 데스크톱에서는 Carousel */}
                    <div className="block md:hidden">
                      <TopNovelList />
                    </div>
                    <div className="hidden md:block">
                      <TopNovelListCarousel />
                    </div>
                  </div>
                </section>
              </div>
            </main>
            <Footer />
          </div>
        </div>
      </HomePageClient>
    </>
  );
}
