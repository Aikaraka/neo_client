"use client";

import { useEffect, useState, useRef } from "react";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { getNovelDetail } from "@/app/_api/novel.server";
import { BookOpen, Users } from "lucide-react";
import { useNovelModal } from "@/hooks/useNovelModal"; // Zustand 스토어 import
import { useAuth } from "@/utils/supabase/authProvider";
import { LoginPromptModal } from "@/components/common/LoginPromptModal";

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
  asset_url: z.string().optional(),
});

const CharacterArraySchema = z.array(CharacterSchema);
type Character = z.infer<typeof CharacterSchema>;
/* -------------------------------- */

export function NovelDetailModal() {
  const { isModalOpen, selectedNovelId, closeModal } = useNovelModal();
  const { session } = useAuth();
  const router = useRouter();
  
  // 스크롤 인터랙션 상태
  const [scrollY, setScrollY] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  
  // 로그인 유도 모달 상태
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

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

  // 스크롤 이벤트 리스너 (throttled for performance)
  useEffect(() => {
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const container = scrollContainerRef.current;
          const titleElement = titleRef.current;
          
          if (!container || !titleElement) return;
          
          const scrollTop = container.scrollTop;
          setScrollY(scrollTop);
          
          // 제목이 상단에 닿았는지 확인
          const titleRect = titleElement.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const isAtTop = titleRect.top <= containerRect.top + 50; // 50px 여유
          
          setIsSticky(isAtTop);
          ticking = false;
        });
        ticking = true;
      }
    };

    const container = scrollContainerRef.current;
    if (container && isModalOpen && novel) {
      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [isModalOpen, novel]);

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
         className="relative max-w-3xl w-full max-h-[80vh] bg-white text-foreground rounded-2xl p-0 flex flex-col overflow-hidden [&>button]:z-[9999]">
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

  const getCharacterDetails = (character: Character) => {
    const details = [character.age];
    if (character.gender === "MALE") {
      details.push("남");
    } else if (character.gender === "FEMALE") {
      details.push("여");
    }
    return `(${details.filter(Boolean).join(", ")})`;
  };

  const protagonist = characters.find(c => c.role === 'protagonist');
  const otherCharacters = characters.filter(c => c.role !== 'protagonist');

  const authorInfo = Array.isArray(novel.users) ? novel.users[0] : novel.users;
  const authorNickname = authorInfo?.nickname ?? "익명의 작가";
  const authorAvatarUrl = authorInfo?.avatar_url;

  // 표지 크기 계산 (스크롤에 따라 1.0 → 0.6 범위)
  const maxScroll = 200; // 200px 스크롤 시 최소 크기
  const minScale = 0.6;
  const maxScale = 1.0;
  const coverScale = Math.max(minScale, maxScale - (scrollY / maxScroll) * (maxScale - minScale));

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
        className="relative max-w-3xl w-full max-h-[80vh] bg-white text-foreground rounded-2xl p-0 flex flex-col overflow-hidden [&>button]:z-[9999] border border-gray-200 shadow-2xl"
      >
        {/* 접근성 해결: Description만 숨김 처리 */}
        <DialogDescription className="sr-only absolute -top-full">
          선택한 세계관의 줄거리, 캐릭터 정보 및 상세 내용을 확인할 수 있습니다.
        </DialogDescription>

        {/* Sticky 헤더 - 스크롤 시 나타남 */}
        <div 
          className={`absolute top-0 left-0 right-0 z-50 bg-gray-100/95 backdrop-blur-sm border-b border-gray-200 px-6 py-4 transition-all duration-300 ease-out rounded-t-2xl ${
            isSticky ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
          }`}
          style={{ borderRadius: '8px 8px 0 0' }}
        >
          <div className="flex flex-col items-center gap-2">
            {/* 제목 */}
            <h2 className="text-lg font-bold text-gray-900 text-center">
              {novel.title}
            </h2>
            
            {/* 태그 */}
            <div className="flex flex-wrap gap-1 justify-center">
              {novel.mood?.slice(0, 10).map((tag: string) => (
                <span 
                  key={tag} 
                  className="bg-white text-[#858585] px-2 py-0.5 rounded-full border border-white text-[10px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* 스크롤 영역 */}
        <div 
          ref={scrollContainerRef}
          className="relative z-10 flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] bg-white"
        >
          {/* 배경 레이어 - 피그마 디자인 반영 */}
          {novel.image_url && (
            <div className="absolute inset-0 -z-10 pointer-events-none">
              {/* 1. 원본 배경 이미지 */}
              <Image
                src={novel.image_url}
                alt="배경"
                fill
                priority
                className="object-cover object-top"
              />
              
              {/* 2. 20% 검정색 오버레이 */}
              <div className="absolute inset-0 bg-black/5" />
              
               {/* 3. 백그라운드 블러 효과 */}
               <div className="absolute inset-0 backdrop-blur-[2px]" 
                    style={{ 
                      background: 'linear-gradient(to bottom, rgba(217,217,217,0) 0%, #FCFCFC 80%, #FCFCFC 100%)' 
                    }} />
            </div>
          )}
          <div className="relative flex flex-col items-center w-full p-6 md:p-8">
            {/* 표지 */}
            <div 
              className="relative w-44 h-60 md:w-56 md:h-80 mx-auto rounded-xl overflow-hidden mb-4 transition-transform duration-150 ease-out"
              style={{ transform: `scale(${coverScale})` }}
            >
              <Image
                src={novel.image_url || "https://i.imgur.com/D1fNsoW.png"}
                alt={novel.title ?? "세계관 표지"}
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 제목 */}
            <DialogTitle asChild>
              <h1 
                ref={titleRef}
                className="text-[23px] font-extrabold text-center mb-2 w-full truncate"
              >
                {novel.title}
              </h1>
            </DialogTitle>

            {/* 태그 */}
            <div className="flex flex-wrap gap-1 justify-center mb-4 w-full">
              {novel.mood?.map((tag: string) => (
                <span 
                  key={tag} 
                  className="bg-white text-[#858585] px-3 py-1 rounded-full border border-white"
                  style={{ 
                    fontSize: '11.62px' 
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 작가 */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-full w-fit mx-auto border border-[#D3CFE8]">
              <div className="relative w-4 h-4 rounded-full overflow-hidden">
                <Image
                  src={authorAvatarUrl || "/neo_emblem.svg"}
                  alt={`${authorNickname} 프로필`}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-gray-700">{authorNickname}</span>
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
                <div className="bg-background rounded-lg p-4 space-y-4 border-2 border-[#D3CFE8]">
                   {protagonist || otherCharacters.length ? (
                     <>
                       {protagonist && (
                         <div className="text-sm flex gap-3">
                           {protagonist.asset_url && (
                             <div 
                               className="relative flex-shrink-0 bg-gray-50 rounded-md"
                               style={{ width: '84px', height: '108px' }}
                             >
                               <Image
                                 src={protagonist.asset_url}
                                 alt={`${protagonist.name} 캐릭터 에셋`}
                                 fill
                                 className="object-contain rounded-md"
                               />
                             </div>
                           )}
                           <div className="flex-1">
                             <p className="font-semibold text-foreground">
                               {protagonist.name} {getCharacterDetails(protagonist)}
                             </p>
                             <p className="font-semibold text-primary my-1">
                               당신이 플레이 할 주인공
                             </p>
                             <p className="text-muted-foreground whitespace-pre-wrap">{protagonist.description}</p>
                           </div>
                         </div>
                       )}
                       {otherCharacters.map((c, i) => (
                         <div key={i} className="text-sm flex gap-3">
                           {c.asset_url && (
                             <div 
                               className="relative flex-shrink-0 bg-gray-50 rounded-md"
                               style={{ width: '84px', height: '108px' }}
                             >
                               <Image
                                 src={c.asset_url}
                                 alt={`${c.name} 캐릭터 에셋`}
                                 fill
                                 className="object-contain rounded-md"
                               />
                             </div>
                           )}
                           <div className="flex-1">
                             <p className="font-semibold text-foreground">
                               {c.name} {getCharacterDetails(c)}
                             </p>
                             <p className="text-muted-foreground whitespace-pre-wrap">{c.description}</p>
                           </div>
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

        {/* 하단 고정 버튼 - 절대 위치로 버튼만 배치 */}
          <Button
            size="lg"
            className="gradient-btn w-[12rem] rounded-full text-primary-foreground font-bold text-base flex items-center justify-between px-4 absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
            onClick={() => {
              // 로그인 체크
              if (!session?.user) {
                // 비로그인 상태: 로그인 유도 모달 표시
                setIsLoginPromptOpen(true);
                return;
              }
              
              // 로그인 상태: 페이지 이동
              closeModal();
              router.push(`/novel/${novel.id}/chat`);
            }}
          >        
            <span>세계관 진입하기</span>
            <Image src="/arrow_right.png" alt="arrow-right" width={20} height={20} />
          </Button>

        {/* 로그인 유도 모달 */}
        <LoginPromptModal
          isOpen={isLoginPromptOpen}
          onClose={() => setIsLoginPromptOpen(false)}
          returnUrl={`/novel/${novel.id}/chat`}
        />
      </DialogContent>
    </Dialog>
  );
}

