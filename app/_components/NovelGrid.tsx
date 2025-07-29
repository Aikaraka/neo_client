"use client";

import { useNovelModalContext } from "@/contexts/NovelModalContext";
import { Tables } from "@/utils/supabase/types/database.types";
import Image from "next/image";
import { Book, BookShelf } from "@/components/ui/book";

export function NovelGrid({ novelList }: { novelList: Tables<"novels">[] }) {
  const { openModal } = useNovelModalContext();

  return (
    <div className="relative">
      {/* 전체 화면 베이지색 제목 배경 */}
      <div
        className="absolute bottom-0 h-5 bg-[#F6F3F1] shadow-sm"
        style={{
          left: "max(50% - 590px, -30px)",
          width: "min(1160px, 111.11vw)",
        }}
      />

      {/* 전체 화면 회색 책장 바닥 */}
      <div
        className="absolute bottom-5 h-1/2 bg-[#dbdbdb]"
        style={{
          left: "max(50% - 590px, -30px)",
          width: "min(1160px, 111.11vw)",
        }}
      />

      <BookShelf>
        {novelList?.map((novel) => {
          const title = novel.title || "제목 없음";
          return (
            <div
              key={novel.id}
              className="flex flex-col items-center cursor-pointer"
              onClick={() => openModal(novel.id as unknown as string)}
            >
              <Book
                className="relative bg-card text-card-foreground shadow-sm shrink-0 z-10"
                style={{
                  width: "clamp(150px, 18vw, 180px)",
                  height: "clamp(200px, calc(18vw * 1.33), 240px)",
                }}
              >
                <Image
                  src={
                    novel.image_url
                      ? novel.image_url
                      : "https://i.imgur.com/D1fNsoW.png"
                  }
                  alt={novel.title ?? "Novel Title"}
                  width={180}
                  height={240}
                  className="rounded-t-lg object-cover w-full h-full z-30"
                />
              </Book>
              <div className="h-5 bg-transparent flex items-center justify-center mt-1 relative z-10">
                <p className="text-sm font-light text-center px-2">
                  <span className="md:hidden">
                    {title.length > 9 ? `${title.slice(0, 7)}...` : title}
                  </span>
                  <span className="hidden md:inline">
                    {title.length > 15 ? `${title.slice(0, 14)}...` : title}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </BookShelf>
    </div>
  );
} 