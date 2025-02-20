"use client";

import { useEffect, useRef, useState } from "react";
import { useSupabase, useUser } from "@/utils/supabase/authProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/layout/scroll-area";
import { Sparkles, Heart, Mountain } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import { signout } from "@/utils/supabase/service/auth";
import { createClient } from "@/utils/supabase/client";

// Novel 타입 정의
interface Novel {
  id: string;
  title: string;
  image_url: string;
  settings: {
    isPublic: boolean;
  };
}

export default function Home() {
  const supabase = useSupabase();
  const user = useUser();
  const navRef = useRef<HTMLDivElement>(null);
  const [recommendedNovels, setRecommendedNovels] = useState<Novel[]>([]);
  const [topNovels, setTopNovels] = useState<Novel[]>([]);
  const [userTokens, setUserTokens] = useState<number>(0);

  useEffect(() => {
    // 공개된 소설 가져오기
    const fetchPublicNovels = async () => {
      try {
        const { data: novels, error } = await supabase
          .from('novels')
          .select('*')
          .eq('settings->isPublic', true)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // 최신 소설 8개를 추천 소설로
        setRecommendedNovels(novels.slice(0, 8));
        // 나머지를 인기 소설로 (실제로는 다른 기준 사용 가능)
        setTopNovels(novels.slice(8, 14));
      } catch (error) {
        console.error('소설 로딩 에러:', error);
      }
    };

    fetchPublicNovels();
  }, [supabase]);

  useEffect(() => {
    const fetchUserTokens = async () => {
      if (!user) {
        console.log("No user found");
        return;
      }
      
      console.log("Fetching tokens for user:", user.id);
      
      // single() 대신 일반 쿼리 사용
      const { data, error } = await supabase
        .from('user_ai_token')
        .select('remaining_tokens')
        .eq('user_id', user.id);
        
      if (error) {
        console.error("Error fetching tokens:", error);
        return;
      }
      
      // 데이터가 없으면 새로운 레코드 생성
      if (!data || data.length === 0) {
        const { data: newData, error: insertError } = await supabase
          .from('user_ai_token')
          .insert([
            { user_id: user.id, remaining_tokens: 300 }
          ])
          .select()
          .single();
          
        if (insertError) {
          console.error("Error creating token record:", insertError);
          return;
        }
        
        setUserTokens(newData?.remaining_tokens || 0);
      } else {
        setUserTokens(data[0]?.remaining_tokens || 0);
      }
    };

    fetchUserTokens();
  }, [supabase, user]);

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
              {userTokens}
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
                {recommendedNovels.map((novel) => (
                  <Card key={novel.id} className="w-[150px] shrink-0">
                    <Link href={`/novel/${novel.id}/detail`}>
                      <CardContent className="p-0">
                        <Image
                          src={novel.image_url || '/default-cover.png'}
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
                {topNovels.map((novel) => (
                  <Card key={novel.id} className="w-[150px] shrink-0">
                    <Link href={`/novel/${novel.id}/detail`}>
                      <CardContent className="p-0">
                        <Image
                          src={novel.image_url || '/default-cover.png'}
                          alt={novel.title}
                          width={150}
                          height={200}
                          className="rounded-t-lg object-cover"
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
