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
      <div className="flex w-full bg-background relative" style={{ height: '111.11vh' }}>
        <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hidden">
          {/* Header */}
          <MainHeader />

          {/* Main Content */}
          <main className="flex-1 w-full flex justify-center">
            <div className="w-full max-w-[1160px] px-4">
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
                    left: 'max(50% - 590px, -30px)',
                    width: 'min(1160px, 111.11vw)'
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
                    left: 'max(50% - 590px, -30px)',
                    width: 'min(1160px, 111.11vw)'
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
