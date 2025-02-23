import { getNovelDetail } from "@/app/novel/[id]/detail/_api/novelDetail.server";
import { ScrollArea, ScrollBar } from "@/components/layout/scroll-area";
import PrevPageButton from "@/components/ui/PrevPageButton";

import Image from "next/image";
import Link from "next/link";

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
const NOVEL_MAX_LENGTH = 400;

export default async function NovelDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const novelId = (await params).id;
  const novel = await getNovelDetail(novelId);

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      <PrevPageButton color="white" />
      <div className="relative z-10">
        {/* Absolute Header */}
        <div className="container">
          {/* Background Image */}
          <div className="absolute w-full h-auto z-0">
            <Image
              src={novel.image_url ?? ""}
              alt={novel.title}
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
                src={novel.image_url ?? ""}
                alt={novel.title}
                width={250}
                height={250}
                className="w-64 h-64 object-fill rounded-lg shadow-lg mx-auto mb-4"
              />
              <div className="text-center max-w-[75%] mx-auto">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="bg-yellow-400 rounded-full font-bold tracking-tighter leading-none text-center text-sm p-1">
                    12
                  </span>

                  <h1 className="text-xl font-bold truncate">{novel.title}</h1>
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
                <div className="top-0 p-10 w-full absolute inset-0 overflow-hidden">
                  <p className="text-sm h-full leading-relaxed text-white font-thin break-words text-ellipsis overflow-hidden">
                    {novel.plot.length > NOVEL_MAX_LENGTH
                      ? novel.plot.slice(0, NOVEL_MAX_LENGTH) + "..."
                      : novel.plot}
                  </p>
                </div>
              </div>
            </div>
            <section className="mb-6 p-1 flex flex-col gap-4">
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
      </div>

      {/* Floating '소설 읽기' Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-50">
        <div className="container max-w-md mx-auto flex justify-center mb-4">
          <Link
            href={`/novel/${novelId}/chat`}
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
