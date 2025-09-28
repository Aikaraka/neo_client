"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Tables } from "@/utils/supabase/types/database.types";
import { getPersonalizedHomeLists } from "@/app/_api/home.client.actions";
import { MainBanner } from "./MainBanner";
import {
  NovelListByGenre,
  NovelListByGenreCarousel,
  RecommendedNovelList,
  RecommendedNovelListCarousel,
  TopNovelList,
  TopNovelListCarousel,
} from "./NovelList";

interface HomeClientProps {
  initialGenreNovels: Tables<"novels">[];
  initialRecommendedNovels: Tables<"novels">[];
  initialTopNovels: any[]; // getNovelsByView returns a different type
}

export function HomeClient({
  initialGenreNovels,
  initialRecommendedNovels,
  initialTopNovels,
}: HomeClientProps) {
  const [genreNovels, setGenreNovels] = useState(initialGenreNovels);
  const [recommendedNovels, setRecommendedNovels] = useState(
    initialRecommendedNovels
  );
  const [topNovels, setTopNovels] = useState(initialTopNovels);

  useEffect(() => {
    const revalidateForUser = async () => {
      const personalizedLists = await getPersonalizedHomeLists();
      if (personalizedLists) {
        setGenreNovels(personalizedLists.genre);
        setRecommendedNovels(personalizedLists.recommended);
        setTopNovels(personalizedLists.top);
      }
    };

    revalidateForUser();
  }, []);

  return (
    <div className="w-full max-w-[1160px] relative p-4">
      <MainBanner />
      {/* Genres Section */}
      <section className="relative">
        <h2 className="text-lg md:text-[22px] font-semibold mb-4 flex items-center">
          <Image
            src="/novel/genre_badge.svg"
            alt="icon"
            width={20}
            height={20}
            className="h-5 md:h-6 w-auto mr-2"
          />
          장르별 세계관 추천
        </h2>
        <div className="relative overflow-visible">
          <div className="block md:hidden">
            <NovelListByGenre novelList={genreNovels} />
          </div>
          <div className="hidden md:block">
            <NovelListByGenreCarousel novelList={genreNovels} />
          </div>
        </div>
      </section>

      {/* Recommended Section */}
      <section className="relative pt-20">
        <h2 className="text-lg md:text-[22px] font-semibold flex items-center">
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
          <div className="block md:hidden">
            <RecommendedNovelList novelList={recommendedNovels} />
          </div>
          <div className="hidden md:block">
            <RecommendedNovelListCarousel novelList={recommendedNovels} />
          </div>
        </div>
      </section>

      {/* Top 5 Section */}
      <section className="relative pt-20 pb-10">
        <h2 className="text-lg md:text-[22px] font-semibold flex items-center">
          <Image
            src="/novel/top_badge.svg"
            alt="icon"
            width={20}
            height={20}
            className="h-5 md:h-6 w-auto mr-2"
          />
          실시간 TOP 5 세계관
        </h2>
        <div className="relative overflow-visible">
          <div className="block md:hidden">
            <TopNovelList novelList={topNovels} />
          </div>
          <div className="hidden md:block">
            <TopNovelListCarousel novelList={topNovels} />
          </div>
        </div>
      </section>
    </div>
  );
}
