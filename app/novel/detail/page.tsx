"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/layout/scroll-area";
import Image from "next/image";
import Link from "next/link";

const TITLE = "천공의 연금술사";
const TAGS = ["판타지", "이세계", "마법", "과학"];
const GENRE = "판타지";
const DESCRIPTION =
  "아에토리아는 마법과 과학이 완벽하게 융합된 독특한 세계입니다. 이곳은 자연의 원리를 이해하고 조작하는 과학과, 신비로운 에너지인 마나를 기반으로 한 마법이 상호작용하며 공존하는 곳입니다. 사람들이 마법을 배우면서도 첨단 기술을 일상적으로 사용하는 모습을 볼 수 있습니다. 예를 들어, 마법으로 구동되는 기계나 마법 에너지로 움직이는 비행선, 그리고 마법사와 과학자가 함께 개발한 치유 기계가 대표적입니다. 이러한 세계는 인간과 다른 종족들이 함께 거주하며 조화를 이루고 있지만, 과거에는 마법과 과학 간의 갈등이 심했던 역사를 가지고 있습니다.";

const RELATED_NOVELS = [
  { title: "난쟁이와 백설공주", image: "/example/temp1.png" },
  { title: "마법학교 아르피아", image: "/example/temp2.png" },
  { title: "인어의 가족들", image: "/example/temp3.png" },
];

const STRATEGY_NOVELS = [
  { title: "미래로 왔는데, 돈이 없다.", image: "/example/temp4.png" },
  { title: "나니아 연대기", image: "/example/temp5.png" },
  { title: "스타듀밸리", image: "/example/temp6.png" },
];

export default function NovelDetail() {
  return (
    <div className="min-h-screen bg-background pb-20 relative">
      <div className="relative z-10">
        {/* Absolute Header */}
        <Link href={"/"} className="absolute z-10 top-4 left-4 text-white">
          <Image
            src={"/novel/chevron-left.svg"}
            alt={"chevron-left"}
            width={12}
            height={12}
          />
        </Link>
        <div className="container">
          {/* Background Image */}
          <div className="absolute w-full h-auto z-0">
            <Image
              src={"/example/aetoria.png"}
              alt={TITLE}
              width={450}
              height={450}
              className="w-full h-auto"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-background" />
          </div>
          <div className="px-4 py-16 z-10">
            {/* Novel Thumbnail and Info */}
            <div className="absolute inset-0 top-10 w-full px-4 my-6">
              <Image
                src={"/example/aetoria.png"}
                alt={TITLE}
                width={250}
                height={250}
                className="w-[70%] h-auto rounded-lg shadow-lg mx-auto mb-4"
              />
              <div className="text-center max-w-[75%] mx-auto">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="bg-yellow-400 rounded-full font-bold tracking-tighter leading-none text-center text-sm p-1">
                    12
                  </span>

                  <h1 className="text-xl font-bold truncate">{TITLE}</h1>
                </div>
                <div className="flex flex-wrap justify-center gap-1">
                  {TAGS.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-transparent rounded-full text-xs border border-gray-300 text-gray-500"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Novel Summary */}
            <div className="mt-[400px] mb-6 p-1 flex flex-col gap-2">
              <h2 className="text-base font-bold flex items-center gap-1">
                <Image
                  src={"/bookmark.svg"}
                  alt={"description"}
                  width={20}
                  height={20}
                />
                소설 줄거리
              </h2>

              <div className="relative">
                <Image
                  src={"/novel/description-bg.png"}
                  alt={"description"}
                  width={250}
                  height={200}
                  className="w-full h-[350px] relative"
                />
                <p className="text-sm leading-relaxed text-white font-thin absolute inset-0 top-10 p-8">
                  {DESCRIPTION}
                </p>
              </div>
            </div>

            {/* Novel Info
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
            </div> */}

            {/* Related Novels */}
            <section className="mb-6 p-1 flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <h2 className="text-base font-bold flex items-center leading-none gap-1">
                  <Image
                    src={"/snowflake.svg"}
                    alt={"related"}
                    width={24}
                    height={24}
                  />
                  &lsquo;{TITLE}&apos;와 함께 본 소설
                </h2>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex space-x-4">
                    {RELATED_NOVELS.map((novel, index) => (
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
              </div>

              <div className="flex flex-col gap-2">
                <h2 className="text-base font-bold flex items-center leading-none gap-1">
                  <Image
                    src={"/snowflake.svg"}
                    alt={"strategy"}
                    width={24}
                    height={24}
                  />
                  &lsquo;{GENRE}&apos; 장르 소설 추천
                </h2>
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex space-x-4">
                    {STRATEGY_NOVELS.map((novel, index) => (
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
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Floating '소설 읽기' Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-50">
        <div className="container max-w-md mx-auto flex justify-center mb-4">
          <Link
            href={"/novel/chat"}
            className=" bg-gradient-to-r from-[#515398] to-[#1B1B32] text-white pointer-events-auto rounded-full px-6 py-4 flex items-center gap-2"
          >
            소설 읽기
            <Image
              src={"/novel/chevron-right.svg"}
              alt={"chevron-right"}
              width={8}
              height={14}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
