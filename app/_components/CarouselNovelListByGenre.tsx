"use client";

import { CarouselNovelList } from "@/app/_components/CarouselNovelList";
import { Button } from "@/components/ui/button";
import { Category, Tables } from "@/utils/supabase/types/database.types";
import { useState } from "react";
import Link from "next/link";

const genre: Category[] = ["로맨스", "이세계", "회귀", "헌터", "무협"];
const genreToUrl: Record<string, string> = {
  "로맨스": "romance",
  "이세계": "isekai",
  "회귀": "regression",
  "헌터": "hunter",
  "무협": "martial-arts"
};

export function CarouselNovelListByGenreSelector({
  novelList,
}: {
  novelList: Tables<"novels">[];
}) {
  const [filter, setFilter] = useState<string>("신작");

  const filteredNovelList = filter === "신작" 
    ? novelList
    : novelList.filter((novel) => novel.mood.includes(filter as Category));

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        <Button
          key="신작"
          type="button"
          variant={filter === "신작" ? "default" : "outline"}
          className={`rounded-full ${
            filter !== "신작" 
              ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-50" 
              : ""
          }`}
          onClick={() => setFilter("신작")}
        >
          신작
        </Button>
        {genre.map((g) => (
          <Link key={`genre-${g}`} href={`/genre/${genreToUrl[g]}`}>
            <Button
              type="button"
              variant={filter === g ? "default" : "outline"}
              className={`rounded-full ${
                filter !== g 
                  ? "bg-white text-gray-800 border-gray-300 hover:bg-gray-50" 
                  : ""
              }`}
            >
              {g}
            </Button>
          </Link>
        ))}
      </div>
      <CarouselNovelList rows={2} novelList={filteredNovelList} />
    </div>
  );
} 