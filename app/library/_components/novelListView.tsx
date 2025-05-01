import { Book } from "@/components/ui/book";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { LibraryNovel } from "@/types/library";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

function NovelListView({
  novelList,
}: {
  novelList: LibraryNovel[] | undefined;
}) {
  return (
    <>
      {novelList?.map((novel) => (
        <div
          key={novel.novel_id}
          className="p-2  hover:shadow-md transition-shadow cursor-pointer flex gap-2 items-center"
        >
          <Book
            href={`/novel/${novel.novel_id}/chat`}
            className="relative"
            size={"extraSmall"}
            shadow={false}
          >
            {novel.cover_image ? (
              <Image
                src={novel.cover_image}
                alt={novel.title}
                width={60}
                height={60}
                className="object-cover w-[45px] h-[60px]"
              />
            ) : (
              <div className=" bg-gray-200 w-[45px] h-[60px]" />
            )}
          </Book>
          <div className="flex flex-col flex-1 justify-center">
            <p className="text-lg font-semibold">{novel.title}</p>
            <div className="flex items-center justify-between gap-2">
              <Progress className="h-3 w-full" value={novel.progress_rate} />
              <span>{novel.progress_rate}%</span>
            </div>
          </div>
          <Button variant={"ghost"} className="hover:bg-none">
            이어보기
            <ChevronRight />
          </Button>
        </div>
      ))}
    </>
  );
}

export default NovelListView;
