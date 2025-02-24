import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Heart, Mountain } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import {
  NovelListErrorFallback,
  NovelListSkeleton,
  RecommendedNovelList,
  TopNovelList,
} from "@/app/_components/NovelList";
import TokenBadge from "@/components/common/tokenBadge";
import SuspenseBoundary from "@/components/common/suspenseBoundary";

export default async function Home() {
  const genres = [
    { title: "판타지", icon: Sparkles },
    { title: "로맨스", icon: Heart },
    { title: "추리", icon: Mountain },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background relative">
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
            <Button variant="ghost" size="icon" className="hover:bg-accent">
              <Image
                src="/search.svg"
                alt="Search Icon"
                width={20}
                height={20}
                className="h-5 w-5"
              />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-16">
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
            <SuspenseBoundary
              suspenseFallback={<NovelListSkeleton />}
              errorFallback={<NovelListErrorFallback />}
            >
              <RecommendedNovelList />
            </SuspenseBoundary>
          </section>

          {/* Top 5 Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🔥</span>
              실시간 TOP 5 소설
            </h2>
            <SuspenseBoundary
              suspenseFallback={<NovelListSkeleton />}
              errorFallback={<NovelListErrorFallback />}
            >
              <TopNovelList />
            </SuspenseBoundary>
          </section>

          {/* Genres Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4">장르</h2>
            <div className="grid grid-cols-3 gap-4">
              {genres.map((genre, index) => {
                const Icon = genre.icon;
                return (
                  <Card key={index} className="aspect-square">
                    <CardContent className="p-4 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                        <Icon className="h-6 w-6 text-purple-500" />
                      </div>
                      <span className="text-sm">{genre.title}</span>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </div>
      </main>
      {/* Navigation Bar */}
      <Navbar />
    </div>
  );
}
