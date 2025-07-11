import Image from "next/image";
import {
  NovelListByGenre,
  RecommendedNovelList,
  TopNovelList,
} from "@/app/_components/NovelList";
import { Toaster } from "@/components/ui/toaster";
import MainHeader from "@/app/_components/MainHeader";
import Footer from "@/components/layout/Footer";

export default async function Home() {
  return (
    <Toaster>
      <div className="flex w-full h-screen bg-background relative">
        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hidden">
          {/* Header */}
          <MainHeader />

          {/* Main Content */}
          <main className="flex-1 w-full">
            <div className="w-full px-4 sm:px-6 lg:px-8">
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

                <div className="relative overflow-visible">
                  <RecommendedNovelList />
                </div>
              </section>

              {/* Top 5 Section */}
              <section className="relative pt-10">
                <div
                  className="absolute top-0 h-10 w-full bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-20"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100vw'
                  }}
                />
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

                <div className="relative overflow-visible">
                  <TopNovelList />
                </div>
              </section>

              {/* Genres Section */}
              <section className="relative pt-10 pb-4">
                <div
                  className="absolute top-0 h-10 w-full bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-20"
                  style={{
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '100vw'
                  }}
                />
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
                <div className="relative overflow-visible">
                  <NovelListByGenre />
                </div>
              </section>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    </Toaster>
  );
}
