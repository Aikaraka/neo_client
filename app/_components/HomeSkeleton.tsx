import Image from "next/image";
import { NovelListSkeleton } from "@/app/_components/NovelList";
import { MainBanner } from "./MainBanner";

export function HomeSkeleton() {
  return (
    <div className="w-full max-w-[1160px] relative p-4">
      <MainBanner />
      {/* Genres Section */}
      <section className="relative">
        <h2 className="text-lg md:text-[22px] font-semibold mb-4 flex items-center">
          <Image
            src="/novel/genre_badge.svg"
            alt="icon"
            width={20}
            height={20}
            className="h-5 md:h-6 w-auto mr-2"
          />
          장르별 세계관 추천
        </h2>
        <NovelListSkeleton count={10} />
      </section>

      {/* Recommended Section */}
      <section className="relative pt-20">
        <h2 className="text-lg md:text-[22px] font-semibold flex items-center">
          <Image
            src="/novel/recommend_badge.svg"
            alt="icon"
            width={20}
            height={20}
            className="h-5 md:h-6 w-auto mr-2"
          />
          당신을 위한 맞춤 추천
        </h2>
        <NovelListSkeleton count={5} />
      </section>

      {/* Top 5 Section */}
      <section className="relative pt-20 pb-10">
        <h2 className="text-lg md:text-[22px] font-semibold flex items-center">
          <Image
            src="/novel/top_badge.svg"
            alt="icon"
            width={20}
            height={20}
            className="h-5 md:h-6 w-auto mr-2"
          />
          실시간 TOP 5 세계관
        </h2>
        <NovelListSkeleton count={5} />
      </section>
    </div>
  );
}
