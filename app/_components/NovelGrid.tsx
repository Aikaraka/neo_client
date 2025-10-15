"use client";

import { useNovelModal } from "@/hooks/useNovelModal";
import { Novel } from "@/types/novel";
import Image from "next/image";
import { Book, BookShelf } from "@/components/ui/book";

export function NovelGrid({ novels }: { novels: Novel[] }) {
  const { openModal } = useNovelModal();

  if (!novels || novels.length === 0) {
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
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-lg font-semibold text-center">
              책장이 비어있습니다.
            </p>
          </div>
        </BookShelf>
      </div>
    );
  }

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
        {novels?.map((novel) => {
          const title = novel.title || "제목 없음";
          return (
            <div
              key={novel.id}
              className="flex flex-col items-center cursor-pointer shrink-0"
              style={{ width: "clamp(70px, 30vw, 110px)" }}
              onClick={() => openModal(novel.id as unknown as string)}
            >
              <Book
                className="relative bg-card text-card-foreground shadow-sm shrink-0 z-10"
                style={{
                    width: "clamp(70px, 30vw, 110px)",
                    height: "clamp(93px, calc(30vw * 1.33), 153px)"
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
              <div className="h-5 bg-transparent flex items-center justify-center mt-1 relative z-10 w-full">
                <p className="text-sm font-light text-center px-2 w-full truncate">
                  {title}
                </p>
              </div>
            </div>
          );
        })}
      </BookShelf>
    </div>
  );
} 