import { Book } from "@/components/ui/book";
import { Button } from "@/components/ui/button";
import { Tables } from "@/utils/supabase/types/database.types";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

function NovelListView({
  novelList,
}: {
  novelList: Tables<"novels">[] | undefined;
}) {
  return (
    <>
      {novelList?.map((novel) => (
        <div
          key={novel.id}
          className="p-2 border-b hover:shadow-md transition-shadow cursor-pointer flex gap-2 last:border-none items-center"
        >
          <Book href="" className="w-[45px] h-[60px] relative">
            {novel.image_url ? (
              <Image
                src={novel.image_url}
                alt={novel.title}
                width={60}
                height={60}
                className="rounded-lg object-contain w-[60px] h-[60px] "
              />
            ) : (
              <div className=" bg-gray-200 rounded-lg w-[60px] h-[60px]" />
            )}
          </Book>
          <div className="flex flex-col flex-1 justify-center">
            <p className="text-lg font-semibold">{novel.title}</p>
            <p className="text-xs text-gray-600 mb-2">
              {novel.created_at.substring(0, 10)}
            </p>
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
