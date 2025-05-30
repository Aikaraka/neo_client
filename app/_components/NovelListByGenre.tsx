"use client";

import { NovelList } from "@/app/_components/NovelList";
import { Button } from "@/components/ui/button";
import { Category, Tables } from "@/utils/supabase/types/database.types";
import { useState } from "react";

const genre: Category[] = ["로맨스", "이세계", "회귀", "헌터", "무협"];

export function NovelListByGenreSelector({
  novelList,
}: {
  novelList: Tables<"novels">[];
}) {
  const [filter, setFilter] = useState<Category>(genre[0]);

  const filteredNovelList = novelList.filter((novel) =>
    novel.mood.includes(filter)
  );

  return (
    <div>
      <div className="flex gap-2 mb-5 flex-wrap">
        {genre.map((g) => (
          <Button
            key={`genre-${g}`}
            type="button"
            variant={filter === g ? "default" : "outline"}
            className="rounded-full"
            onClick={() => setFilter(g)}
          >
            {g}
          </Button>
        ))}
      </div>
      <NovelList novelList={filteredNovelList} />
    </div>
  );
}
