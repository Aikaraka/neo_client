"use client";

import { useEffect } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { getNovelDetail } from "@/app/_api/novel.server";
import { User2, BookOpen, Users } from "lucide-react";
import { useNovelModal } from "@/hooks/useNovelModal"; // Zustand 스토어 import

/* ---------- Zod 스키마 ---------- */
const RelationshipSchema = z.object({
  targetName: z.string(),
  relationship: z.string(),
});

const CharacterSchema = z.object({
  name: z.string(),
  age: z.string(),
  role: z.string(),
  gender: z.string(),
  description: z.string(),
  relationships: z.array(RelationshipSchema).optional(),
});

const CharacterArraySchema = z.array(CharacterSchema);
type Character = z.infer<typeof CharacterSchema>;
/* -------------------------------- */

export function NovelDetailModal() {
  const { isModalOpen, selectedNovelId, closeModal } = useNovelModal();

  const { data: novel, isPending } = useQuery({
    queryKey: ["novel-detail", selectedNovelId],
    queryFn: () => getNovelDetail(selectedNovelId!),
    enabled: !!selectedNovelId && isModalOpen,
  });

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && closeModal();
    if (isModalOpen) document.addEventListener("keydown", onEsc);
    return () => document.removeEventListener("keydown", onEsc);
  }, [isModalOpen, closeModal]);

  if (!isModalOpen || !selectedNovelId) return null;
  
  // 스켈레톤 UI (전략 3) - 맛보기 적용
  if (isPending) {
    return (
       <Dialog open={isModalOpen} onOpenChange={closeModal}>
        <DialogContent
         style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          margin: 0,
          zIndex: 50,
        }}
         className="relative max-w-3xl w-full max-h-[80vh] bg-background/80 backdrop-blur-xl text-foreground rounded-2xl p-0 flex flex-col overflow-hidden [&>button]:z-[9999]">
           {/* 접근성 해결: Title과 Description 추가 */}
           <DialogTitle>
              <VisuallyHidden>세계관 상세 정보 로딩 중</VisuallyHidden>
           </DialogTitle>
           <DialogDescription>
              <VisuallyHidden>선택한 세계관의 상세 정보를 불러오고 있습니다.</VisuallyHidden>
           </DialogDescription>
           <div className="w-full h-full p-8 animate-pulse">
              <div className="w-56 h-80 mx-auto rounded-xl bg-muted mb-4"></div>
              <div className="h-8 w-3/4 mx-auto rounded bg-muted mb-2"></div>
              <div className="h-4 w-1/2 mx-auto rounded bg-muted mb-4"></div>
              <div className="h-4 w-1/4 mx-auto rounded bg-muted mb-6"></div>
              <div className="h-24 w-full rounded bg-muted mb-4"></div>
              <div className="h-32 w-full rounded bg-muted"></div>
           </div>
        </DialogContent>
       </Dialog>
    )
  }

  if (!novel) return null;

  /* characters 파싱 */
  let characters: Character[] = [];
  try {
    characters = CharacterArraySchema.parse(novel.characters);
  } catch {
    characters = [];
  }

  const protagonist = characters.find(c => c.role === 'protagonist');
  const otherCharacters = characters.filter(c => c.role !== 'protagonist');

  const authorNickname =
    Array.isArray(novel.users)
      ? novel.users[0]?.nickname
      : novel.users?.nickname ?? "익명의 작가";

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          margin: 0,
          zIndex: 50,
        }}
        className="relative max-w-3xl w-full max-h-[80vh] backdrop-blur-xl text-foreground rounded-2xl p-0 flex flex-col overflow-hidden [&>button]:z-[9999]"
      >
        {/* 배경 + 그라디언트 (fadeout-bg) */}
        {novel.image_url && (
          <div className="absolute inset-0 -z-10 pointer-events-none fadeout-bg">
            <Image
              src={novel.image_url}
              alt="배경"
              fill
              priority
              className="object-cover opacity-70 blur-[24px] brightness-75"
            />
          </div>
        )}

        <DialogTitle>
          <VisuallyHidden>세계관 상세 정보</VisuallyHidden>
        </DialogTitle>
        {/* 접근성 해결: Description 추가 */}
        <DialogDescription>
          <VisuallyHidden>{novel.title} 세계관의 줄거리, 등장인물 등 상세 정보를 확인할 수 있습니다.</VisuallyHidden>
        </DialogDescription>

        {/* 스크롤 영역 */}
        <div className="relative z-10 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="relative flex flex-col items-center w-full p-6 md:p-8">
            {/* 표지 */}
            <div className="relative w-44 h-60 md:w-56 md:h-80 mx-auto rounded-xl overflow-hidden mb-4 border-2 border-white/80">
              <Image
                src={novel.image_url || "https://i.imgur.com/D1fNsoW.png"}
                alt={novel.title ?? "세계관 표지"}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 제목 */}
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 w-full truncate">
              {novel.title}
            </h1>

            {/* 태그 */}
            <div className="flex flex-wrap gap-2 justify-center mb-4 w-full">
              {novel.mood?.map((tag: string) => (
                <span key={tag} className="text-sm text-white">
                  {tag}
                </span>
              ))}
            </div>

            {/* 작가 */}
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
              <User2 className="w-4 h-4" />
              <span>{authorNickname}</span>
            </div>

            {/* 내용 카드 */}
            <div className="flex flex-col gap-4 w-full mt-4">
              {/* 줄거리 */}
              <section className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  세계관 줄거리
                </h2>
                <div className="bg-background rounded-lg p-4 text-sm text-muted-foreground leading-relaxed border-2 border-[#D3CFE8] whitespace-pre-wrap">
                  {novel.plot || "줄거리 정보가 없습니다."}
                </div>
              </section>

              {/* 캐릭터 */}
              <section className="flex flex-col gap-2">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  캐릭터 서사
                </h2>
                <div className="bg-background rounded-lg p-4 space-y-3 border-2 border-[#D3CFE8]">
                   {protagonist || otherCharacters.length ? (
                     <>
                       {protagonist && (
                         <div className="text-sm">
                           <p className="font-semibold text-foreground">
                             {protagonist.name} ({protagonist.age})
                           </p>
                           <p className="font-semibold text-primary my-1">
                             당신이 플레이 할 주인공
                           </p>
                           <p className="text-muted-foreground whitespace-pre-wrap">{protagonist.description}</p>
                         </div>
                       )}
                       {otherCharacters.map((c, i) => (
                         <div key={i} className="text-sm">
                           <p className="font-semibold text-foreground">
                             {c.name} ({c.age})
                           </p>
                           <p className="text-muted-foreground whitespace-pre-wrap">{c.description}</p>
                         </div>
                       ))}
                     </>
                   ) : (
                     <p className="text-sm text-muted-foreground">
                       캐릭터 정보가 없습니다.
                     </p>
                   )}
                  </div>
               </section>
            </div>
          </div>
        </div>

        {/* 하단 버튼 */}
        <Link href={`/novel/${novel.id}/chat`} passHref>
          <Button
            size="lg"
            className="gradient-btn absolute bottom-4 left-1/2 -translate-x-1/2 w-[12rem] rounded-full text-primary-foreground font-bold py-3 text-base z-50 flex items-center justify-between px-2"
          >
            <span>세계관 진입하기</span>
            <Image src="/arrow_right.png" alt="arrow-right" width={20} height={20} />
          </Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}

