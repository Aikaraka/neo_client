"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface Novel {
  id: string;
  title: string;
  image_url?: string;
  updated_at: string;
}

interface NovelListClientProps {
  novels: Novel[];
}

export default function NovelListClient({ novels }: NovelListClientProps) {
  const [sortOrder, setSortOrder] = useState("updated_at");

  const sortedNovels = [...novels].sort((a, b) => {
    if (sortOrder === "updated_at") {
      return (
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    } else if (sortOrder === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <section className="w-full">
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-xl font-bold">내가 제작한 세계관</h2>
        <div className="relative">
          <select 
            value={sortOrder} 
            onChange={(e) => setSortOrder(e.target.value)}
            className="appearance-none bg-transparent border-0 rounded px-3 py-1 pr-6 text-sm focus:outline-none text-gray-700"
          >
            <option value="updated_at">최근 수정순</option>
            <option value="title">이름순</option>
          </select>
          <ChevronDown className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 text-gray-500 pointer-events-none" />
        </div>
      </div>
      
      {/* 5열 그리드로 소설 카드 표시 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {sortedNovels.map((novel) => (
          <div key={novel.id} className="flex flex-col items-center">
            <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-gray-200 cursor-pointer hover:scale-105 transition-transform">
              <img
                src={novel.image_url || "/neo_emblem.svg"}
                alt={novel.title || "소설 표지"}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-sm text-center mt-2 line-clamp-2 max-w-full">
              {novel.title || "제목 없음"}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

