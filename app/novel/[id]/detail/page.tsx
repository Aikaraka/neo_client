import { getNovelDetail } from "@/app/novel/[id]/detail/_api/novelDetail.server";
import {
  NovelCharacters,
  NovelPlot,
} from "@/app/novel/[id]/detail/_components/NovelInfo";
import { ReadNovelButton } from "@/app/novel/[id]/detail/_components/ReadNovelButton";
import Navbar from "@/components/layout/navbar";
import { ScrollArea, ScrollBar } from "@/components/layout/scroll-area";
import { MainContent } from "@/components/ui/content";
import PrevPageButton from "@/components/ui/PrevPageButton";
import { Toaster } from "@/components/ui/toaster";
import { Character } from "@/types/novel";

import Image from "next/image";

const GENRE = "판타지";

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

export default async function NovelDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const novelId = (await params).id;
  const novel = await getNovelDetail(novelId);
  console.log(novel);

  return (
    <div className="w-full h-screen bg-background pb-20 relative flex justify-center">
      <MainContent className="md:border md:h-[479px] overflow-auto self-center">
        <Toaster>
          <PrevPageButton color="white" className="md:hidden" />
          <div className="relative z-10 h-screen md:h-auto md:flex">
            {/* Absolute Header */}
            <div className="w-full h-auto relative">
              {/* Background Image */}
              <div className="absolute w-full h-auto z-0">
                <Image
                  src={
                    novel.image_url
                      ? novel.image_url
                      : "https://i.imgur.com/D1fNsoW.png"
                  }
                  alt={novel.title}
                  width={450}
                  height={450}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-background" />
              </div>
              <div className="absolute inset-0 top-10 w-full h-full px-4 my-6">
                <div className="w-[180px] h-[240px] relative self-center mx-auto">
                  <Image
                    src={
                      novel.image_url
                        ? novel.image_url
                        : "https://i.imgur.com/D1fNsoW.png"
                    }
                    alt={novel.title}
                    width={150}
                    height={200}
                    className="w-[180px] h-[240px] object-fill rounded-lg shadow-lg mx-auto mb-4"
                  />
                  <Image
                    src={"/novel/book_template.png"}
                    width={180}
                    height={240}
                    className="absolute h-full top-0 z-10"
                    alt="book_template"
                  />
                </div>
                <div className="text-center max-w-[75%] mx-auto my-2">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    {/* <span className="bg-yellow-400 rounded-full font-bold tracking-tighter leading-none text-center text-sm p-1">
                        12
                      </span> */}

                    <h1 className="text-xl font-bold truncate">
                      {novel.title}
                    </h1>
                  </div>
                  <div className="flex flex-wrap justify-center gap-1">
                    {novel.mood.map((tag) => (
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
            </div>
            {/* Novel Thumbnail and Info */}
            <div className="px-4 py-16 z-10 md:w-full md:p-4 md:flex md:flex-col md:justify-center">
              {/* Novel Summary */}
              <div className="mt-[550px] mb-6 p-1 flex flex-col gap-5 md:mt-0 md:w-full">
                <NovelPlot plot={novel.plot} />
                <NovelCharacters characters={novel.characters as unknown as Character[]} />
              </div>
              <section className="mb-6 p-1 flex flex-col gap-4 md:hidden">
                <div className="flex flex-col gap-2">
                  <h2 className="text-base font-bold flex items-center leading-none gap-1">
                    <Image
                      src={"/snowflake.svg"}
                      alt={"related"}
                      width={24}
                      height={24}
                    />
                    &lsquo;{novel.title}&apos;와 함께 본 소설
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

          {/* Floating '소설 읽기' Button */}
          <ReadNovelButton novelId={novelId} />
        </Toaster>
        <Navbar />
      </MainContent>
    </div>
  );
}
