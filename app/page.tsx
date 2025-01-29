"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/layout/scroll-area";
import { Sparkles, Heart, Mountain } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import { signout } from "@/utils/supabase/service/auth";

export default function Home() {
  const navRef = useRef<HTMLDivElement>(null);

  const recommendedNovels = [
    { title: "천공의 연금술사", image: "/example/aetoria.png" },
    { title: "난쟁이와 백설공주", image: "/example/temp1.png" },
    { title: "마법학교 아르피아", image: "/example/temp2.png" },
    { title: "인어공주", image: "/example/temp3.png" },
  ];

  const topNovels = [
    { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
    { title: "나니아 연대기", image: "/example/temp5.png" },
    { title: "스타듀밸리", image: "/example/temp6.png" },
  ];

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
            <Button
              variant="ghost"
              size="sm"
              className="relative bg-purple-500 hover:bg-purple-600 text-white rounded-full p-2 h-6"
            >
              <Image
                src="/header/diamond.svg"
                alt="token icon"
                height={10}
                width={10}
              />
              9999
            </Button>
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
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4">
                {recommendedNovels.map((novel, index) => (
                  <Card key={index} className="w-[150px] shrink-0">
                    <Link href={`/novel/detail`}>
                      <CardContent className="p-0">
                        <Image
                          src={novel.image}
                          alt={novel.title}
                          width={150}
                          height={150}
                          className="object-cover rounded-lg"
                        />
                        <div className="p-2">
                          <p className="text-sm truncate">{novel.title}</p>
                        </div>
                      </CardContent>
                    </Link>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </section>

          {/* Top 5 Section */}
          <section>
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <span className="mr-2">🔥</span>
              실시간 TOP 5 소설
            </h2>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4">
                {topNovels.map((novel, index) => (
                  <Card key={index} className="w-[150px] shrink-0">
                    <CardContent className="p-0">
                      <Image
                        src={novel.image}
                        alt={novel.title}
                        width={150}
                        height={200}
                        className="rounded-t-lg object-cover"
                      />
                      <div className="p-2">
                        <p className="text-sm truncate">{novel.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
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
        <Button onClick={signout}>로그아웃</Button>
      </main>
      {/* Navigation Bar */}
      <Navbar ref={navRef} />
    </div>
  );
}
