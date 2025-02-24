import { ScrollArea, ScrollBar } from "@/components/layout/scroll-area";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getRecommendedNovels } from "@/app/_api/novelList.server";
import Image from "next/image";
import Link from "next/link";
import { Rabbit, Unplug } from "lucide-react";

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
  const novelList = await getRecommendedNovels();

  if (!novelList.length) return <NovelListEmpty />;
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4">
        {novelList?.map((novel, index) => (
          <Card key={index} className="w-[150px] shrink-0">
            <Link href={`/novel/${novel.id}/detail`}>
              <CardContent className="p-0">
                <Image
                  src={
                    novel.image_url
                      ? novel.image_url
                      : "https://i.imgur.com/D1fNsoW.png"
                  }
                  alt={novel.title}
                  width={150}
                  height={150}
                  className="rounded-t-lg object-cover w-[150px] h-[150px]"
                />
                <div className="p-2">
                  <p className="text-sm truncate">{novel.title}</p>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export async function TopNovelList() {
  const novelList = await getRecommendedNovels();

  if (!novelList.length) return <NovelListEmpty />;
  return (
    <ScrollArea className="w-full whitespace-nowrap">
      <div className="flex space-x-4">
        {novelList?.map((novel, index) => (
          <Card key={index} className="w-[150px] shrink-0">
            <Link href={`/novel/${novel.id}/detail`}>
              <CardContent className="p-0">
                <Image
                  src={
                    novel.image_url
                      ? novel.image_url
                      : "https://i.imgur.com/D1fNsoW.png"
                  }
                  alt={novel.title}
                  width={150}
                  height={150}
                  className="rounded-t-lg object-cover w-[150px] h-[150px]"
                />
                <div className="p-2">
                  <p className="text-sm truncate">{novel.title}</p>
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
