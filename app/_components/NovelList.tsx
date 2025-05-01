import { ScrollArea, ScrollBar } from "@/components/layout/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getNovelsByCategory,
  getNovelsByView,
  getRecommendedNovels,
} from "@/app/_api/novelList.server";
import Image from "next/image";
import { Rabbit, Unplug } from "lucide-react";
import { Category, Tables } from "@/utils/supabase/types/database.types";
import { Book, BookShelf } from "@/components/ui/book";
import { NovelListByGenreSelector } from "@/app/_components/NovelListByGenre";

export function NovelList({ novelList }: { novelList: Tables<"novels">[] }) {
  if (!novelList || !novelList.length) return <NovelListEmpty />;
  return (
    <BookShelf>
      {novelList?.map((novel) => (
        <Book
          key={`novel-${novel.id ?? Math.random() * 100}`}
          href={`/novel/${novel.id}/detail`}
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
      ))}
    </BookShelf>
  );
}

export function NovelListEmpty() {
  return (
    <Card className="w-[150px] shrink-0">
      <CardContent className="p-0">
        <div className="w-[150px] h-[150px] rounded-t-lg content-center place-items-center">
          <Rabbit width={50} height={50} className="opacity-15" />
        </div>
        <div className="p-2">등록된 소설이 없습니다.</div>
      </CardContent>
    </Card>
  );
}

export function NovelListErrorFallback() {
  return (
    <div className="w-full flex flex-col justify-center h-28 items-center gap-4">
      <Unplug width={50} height={50} className="opacity-15" />
      <p className="opacity-20">소설 목록을 가져오지 못했습니다.</p>
    </div>
  );
}

export function NovelListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4">
        {Array.from({ length: count }).map((_, index) => (
          <Card key={index} className="w-[150px] shrink-0">
            <CardContent className="p-0">
              <Skeleton className="w-[150px] h-[150px] rounded-t-lg" />
              <div className="p-2">
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

export async function RecommendedNovelList() {
  try {
    const novelList = await getRecommendedNovels();
    return <NovelList novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

export async function TopNovelList() {
  try {
    const novelList = await getNovelsByView();
    //TODO: type 변환
    return <NovelList novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}

const genre: Category[] = ["판타지", "로맨틱", "미스터리"];
export async function NovelListByGenre() {
  try {
    const allNovels = Promise.all(genre.map((g) => getNovelsByCategory(g)));
    const novelList = (await allNovels).flat();
    return <NovelListByGenreSelector novelList={novelList} />;
  } catch {
    return <NovelListErrorFallback />;
  }
}
