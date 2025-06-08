import Image from "next/image";
import Navbar from "@/components/layout/navbar";
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
            <div className="container mx-auto max-w-7xl p-4">
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
                <div className="absolute top-0 h-10 w-full bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-20" />
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
                <div className="absolute top-0 h-10 w-full bg-gradient-to-b from-black/10 to-transparent pointer-events-none z-20" />
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
          <Footer />
        </div>
        {/* Navigation Bar */}
        <Navbar />
      </div>
    </Toaster>
  );
}
