"use client";

import { useNovelModal } from "@/hooks/useNovelModal";
import { Tables } from "@/utils/supabase/types/database.types";
import Image from "next/image";

export default function GenreNovelGrid({ novels }: { novels: Tables<"novels">[] }) {
  /* eslint-disable react-hooks/rules-of-hooks */
  const { openModal } = useNovelModal();

  // 4개의 줄로 나누기 (각 줄에 5개씩)
  const rows = [];
  for (let i = 0; i < novels.length; i += 5) {
    rows.push(novels.slice(i, i + 5));
  }

  return (
    <>
      {rows.map((row, rowIndex) => (
        <section key={rowIndex} className="relative mt-10">
          <div className="relative">
            {/* 전체 화면 흰색 제목 배경 */}
            <div
              className="absolute bottom-0 h-8 shadow-sm"
              style={{
                left: "-2.5rem",
                right: "-2.5rem",
                background: "#FFFFFF",
                boxShadow: "0 6px 38px 11px rgba(85, 69, 58, 0.19)",
              }}
            />

            {/* 전체 화면 회색 책장 바닥 */}
            <div
              className="absolute bottom-8 h-2/5 bg-[#E2E5EA]"
              style={{
                left: "-2.5rem",
                right: "-2.5rem",
              }}
            />

            {/* 소설 표시 영역 */}
            <div className="relative px-12">
              <div className="grid grid-cols-5 gap-5">
                {row.map((novel) => {
                  const title = novel.title || "제목 없음";
                  return (
                    <div
                      key={novel.id}
                      onClick={() => openModal(novel.id as unknown as string)}
                      className="flex flex-col items-center group cursor-pointer"
                    >
                      {/* 책 표지 */}
                      <div
                        className="relative bg-card text-card-foreground shadow-sm shrink-0 z-10 transition-all duration-200 group-hover:scale-105"
                        style={{
                          width: "100%",
                          aspectRatio: "3/4",
                        }}
                      >
                        <Image
                          src={
                            novel.image_url || "https://i.imgur.com/D1fNsoW.png"
                          }
                          alt={novel.title ?? "Novel Title"}
                          fill
                          className="object-cover"
                          sizes="20vw"
                        />
                      </div>

                      {/* 제목 */}
                      <div className="w-full mt-2">
                        <p className="text-center text-gray-800 truncate text-lg">
                          {title}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {/* 빈 공간 채우기 (5개 미만일 때) */}
                {row.length < 5 &&
                  Array.from({ length: 5 - row.length }).map((_, i) => (
                    <div key={`empty-${i}`} className="invisible">
                      <div style={{ width: "100%", aspectRatio: "3/4" }} />
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

