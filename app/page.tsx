import Image from "next/image";
import Navbar from "@/components/layout/navbar";
import {
  NovelListByGenre,
  RecommendedNovelList,
  TopNovelList,
} from "@/app/_components/NovelList";
import { Toaster } from "@/components/ui/toaster";
import MainHeader from "@/app/_components/MainHeader";
import { MainContent } from "@/components/ui/content";

export default async function Home() {
  return (
    <Toaster>
      <div className="flex flex-col h-screen w-full bg-backgroud relative items-center ">
        <MainContent className="scrollbar-hidden h-full overflow-y-auto md:max-h-screen">
          {/* Header */}
          <MainHeader />

          {/* Main Content */}
          <main className="flex-1 overflow-y-auto pb-16 w-full scrollbar-hidden">
            <div className="container max-w-md md:max-w-full p-4 ">
              {/* Recommended Section */}
              <section className="relative">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Image
                    src="/novel/recommend_badge.svg"
                    alt="icon"
                    width={24}
                    height={24}
                    className="h-6 w-auto mr-2"
                  />
                  네오님의 취향 저격
                </h2>

                <RecommendedNovelList />
              </section>

              {/* Top 5 Section */}
              <section className="relative pt-10">
                <div className="absolute top-0 h-10  w-full bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-20" />
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Image
                    src="/novel/top_badge.svg"
                    alt="icon"
                    width={24}
                    height={24}
                    className="h-6 w-auto mr-2"
                  />
                  실시간 TOP 5 소설
                </h2>

                <TopNovelList />
              </section>

              {/* Genres Section */}
              <section className="relative pt-10">
                <div className="absolute top-0 h-10  w-full bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-20" />
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <Image
                    src="/novel/genre_badge.svg"
                    alt="icon"
                    width={24}
                    height={24}
                    className="h-6 w-auto mr-2"
                  />
                  장르별 소설 추천
                </h2>
                <NovelListByGenre />
              </section>
            </div>
          </main>
        </MainContent>
        {/* Navigation Bar */}
        <Navbar />
      </div>
    </Toaster>
  );
}
