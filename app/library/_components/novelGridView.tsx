import { Book } from "@/components/ui/book";
import { Progress } from "@/components/ui/progress";
import { LibraryNovel } from "@/types/library";
import Image from "next/image";
import Link from "next/link";
import { Fragment } from "react";

function NovelGridView({
  layout,
  novelList,
}: {
  layout: "grid" | "smallGrid";
  novelList: LibraryNovel[] | undefined;
}) {
  const itemsPerRow = layout === "grid" ? 3 : 2;

  const rows = novelList
    ? Array.from(
        { length: Math.ceil(novelList.length / itemsPerRow) },
        (_, rowIndex) =>
          novelList.slice(rowIndex * itemsPerRow, (rowIndex + 1) * itemsPerRow)
      )
    : [];

  return (
    <div className="flex-1 overflow-auto">
      <div
        className={`relative grid auto-rows-min gap-4 justify-items-center ${
          layout === "grid" ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {rows.map((row, rowIndex) => (
          <Fragment key={rowIndex}>
            {row.map((novel) => (
              <Link
                href={`/novel/${novel.novel_id}/chat`}
                key={novel.novel_id}
                className="relative p-2 hover:shadow-md transition-shadow cursor-pointer flex flex-col items-center gap-2 w-full"
              >
                <Book
                  href={`/novel/${novel.novel_id}/chat`}
                  size={layout === "grid" ? "default" : "medium"}
                >
                  {novel.cover_image ? (
                    <Image
                      src={novel.cover_image}
                      alt={novel.title}
                      width={105}
                      height={140}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <div className="bg-gray-200 w-full h-full" />
                  )}
                </Book>
                <div className="w-full">
                  <p className="text-ellipsis whitespace-nowrap overflow-hidden">
                    {novel.title}
                  </p>
                  <div className="flex items-center justify-between gap-1">
                    <Progress className="h-3" value={novel.progress_rate} />
                    <span>{novel.progress_rate}%</span>
                  </div>
                </div>
              </Link>
            ))}
            {/* 각 행 끝마다 배경 박스 추가 */}
            <div className="col-span-full absolute w-full h-[65px] bg-[#dbdbdb] bottom-16" />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default NovelGridView;
