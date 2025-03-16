import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import {
  NovelListByGenre,
  RecommendedNovelList,
  TopNovelList,
} from "@/app/_components/NovelList";
import TokenBadge from "@/components/common/tokenBadge";
import { Toaster } from "@/components/ui/toaster";
import Search from "@/app/_components/Search";

export default async function Home() {
  return (
    <Toaster>
      <div className="flex flex-col h-screen bg-background relative">
        {/* Header */}
        <header className="sticky top-0 z-50 w-full border-b bg-background">
          <div className="container flex h-14 max-w-md items-center justify-between px-4">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/neo_emblem.svg"
                alt="NEO Logo"
                width={24}
                height={24}
              />
              <span className="font-semibold text-xl">NEO</span>
            </Link>
            <div className="flex items-center gap-1">
              <TokenBadge />
              <Search />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-16 scrollbar-hidden">
          <div className="container max-w-md p-4 space-y-8">
            {/* Recommended Section */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <Image
                  src="/snowflake.svg"
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
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🔥</span>
                실시간 TOP 5 소설
              </h2>

              <TopNovelList />
            </section>

            {/* Genres Section */}
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🔥</span>
                로맨스 추천 소설
              </h2>

              <NovelListByGenre genre="로맨틱" />
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🔥</span>
                판타지 추천 소설
              </h2>

              <NovelListByGenre genre="판타지" />
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-4 flex items-center">
                <span className="mr-2">🔥</span>
                추리 추천 소설
              </h2>

              <NovelListByGenre genre="미스터리" />
            </section>
          </div>
        </main>
        {/* Navigation Bar */}
        <Navbar />
      </div>
    </Toaster>
  );
}
