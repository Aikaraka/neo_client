"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/layout/scroll-area";
import { ChevronLeft, Users, Clock, Trophy, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function NovelDetail() {
  const tags = [
    "판타지",
    "타임슬립",
    "미래물",
    "자본주의",
    "전략",
    "20대",
    "도시",
  ];

  const relatedNovels = [
    { title: "난쟁이와 백설공주", image: "/example/temp1.png" },
    { title: "마법학교 아르피아", image: "/example/temp2.png" },
    { title: "인어공주", image: "/example/temp3.png" },
  ];

  const strategyNovels = [
    { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
    { title: "나니아 연대기", image: "/example/temp5.png" },
    { title: "스타듀밸리", image: "/example/temp6.png" },
  ];

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative z-10">
        {/* Absolute Header */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute z-10 top-4 left-4 text-white"
          onClick={() => window.history.back()}
        >
          <ChevronLeft className="h-10 w-10" />
        </Button>
        <div className="container">
          {/* Background Image */}
          <div className="absolute w-full h-auto z-0">
            <Image
              src={"/example/temp4.png"}
              alt={"background image"}
              width={450}
              height={450}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-background" />
          </div>
          <div className="absolute px-4 py-16 z-10">
            {/* Novel Thumbnail and Info */}
            <div className="px-4 my-6">
              <Image
                src={"/example/temp4.png"}
                alt={"미래로 왔는데, 돈이 없다."}
                width={300}
                height={300}
                className="w-[75%] h-auto rounded-lg shadow-lg mx-auto mb-4"
              />
              <div className="text-center max-w-[75%] mx-auto">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded">
                    12
                  </span>
                  <h1 className="text-lg font-bold truncate">
                    미래로 왔는데, 돈이 없다.
                  </h1>
                </div>
                <div className="flex flex-wrap justify-center gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-200 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Novel Summary */}
            <div className="mb-4">
              <h2 className="text-base font-bold mb-2 flex items-center gap-2">
                <span className="text-purple-600">▎</span>소설 줄거리
              </h2>
              <div className="p-4 rounded-lg bg-purple-50 text-sm leading-relaxed">
                미래로 온 주인공은 눈앞에 펼쳐진 화려한 도시 풍경에 감탄하지만,
                고개를 숙이니 지갑은 텅 비어 있다. 시간 여행의 대가로 모든
                재산을 잃은 그는 생존을 위해 불법적인 방법들을 선택해야 할지
                고민한다. 그러나 그곳에서 만난 이상한 동료들은 그에게 새로운
                기회를 제시한다. 함께 돈을 벌고, 미래의 비밀을 풀어가는 모험이
                시작된다.
              </div>
            </div>

            {/* Novel Info */}
            <div className="space-y-2 text-sm mb-6">
              <div className="flex items-start gap-4">
                <Trophy className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1 flex justify-between">
                  <span className="font-medium">앤딩 난이도</span>
                  <span>다소 높음</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Clock className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1 flex justify-between">
                  <span className="font-medium">결말 가능성</span>
                  <span>매우 다양함</span>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Users className="h-5 w-5 text-purple-500 mt-0.5" />
                <div className="flex-1 flex justify-between">
                  <span className="font-medium">등장 인물</span>
                  <span>4~6명(엑스트라 미포함)</span>
                </div>
              </div>
            </div>

            {/* Related Novels */}
            <section className="mb-6">
              <h2 className="text-base font-bold mb-4 flex items-center gap-2">
                <span className="text-purple-600">▎</span>
                &lsquo;미래로 왔는데, 돈이 없다.&apos;와 함께 본 소설
              </h2>
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-4">
                  {relatedNovels.map((novel, index) => (
                    <div key={index} className="w-[120px] shrink-0">
                      <Image
                        src={novel.image}
                        alt={novel.title}
                        width={120}
                        height={160}
                        className="rounded-lg object-cover mb-2"
                      />
                      <p className="text-xs truncate">{novel.title}</p>
                    </div>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </section>
          </div>
        </div>
      </div>

      {/* Strategy Novels */}
      <section className="container max-w-md px-4 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold flex items-center gap-2">
            <span className="text-purple-600">▎</span>
            &lsquo;전략&apos; 장르 소설 추천
          </h2>
        </div>
        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex space-x-4">
            {strategyNovels.map((novel, index) => (
              <div key={index} className="w-[120px] shrink-0">
                <Image
                  src={novel.image}
                  alt={novel.title}
                  width={120}
                  height={160}
                  className="rounded-lg object-cover mb-2"
                />
                <p className="text-xs truncate">{novel.title}</p>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </section>

      {/* Floating '소설 읽기' Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-50">
        <div className="container max-w-md mx-auto flex justify-center">
          <Link
            href={"/novel/chat"}
            className="bg-purple-600 hover:bg-purple-700 text-white pointer-events-auto rounded-full px-6 py-2 flex items-center gap-2"
          >
            소설 읽기
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
