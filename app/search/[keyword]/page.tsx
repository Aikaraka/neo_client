"use client";
import NotFound from "@/app/[...404]/page";
import { getSearchResult } from "@/app/search/[keyword]/_api/searchResult.server";
import Navbar from "@/components/layout/navbar";
import Header from "@/components/ui/header";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SearchResultPage() {
  const { keyword } = useParams<{ keyword: string }>();
  const { data: novelList, isError } = useQuery({
    queryFn: () => getSearchResult(keyword),
    queryKey: ["search", keyword],
  });
  if (isError) return <NotFound />;
  return (
    <div className="container h-screen flex flex-col gap-4 pb-20">
      <Header prevPageButton title="검색 결과" />
      <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto scrollbar-hidden">
        <h2 className="text-xl font-semibold mb-4">검색 결과</h2>
        {novelList?.length ? (
          <div className="flex flex-col gap-4">
            {novelList.map((novel) => (
              <Link
                href={`/novel/${novel.id}/detail`}
                key={novel.id}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer flex gap-2 items-center"
              >
                <Image
                  src={novel.image_url ?? "https://i.imgur.com/D1fNsoW.png"}
                  alt={`${novel.title}의 이미지`}
                  width={50}
                  height={50}
                />
                <div className="w-full">
                  <h3 className="text-lg font-semibold">{novel.title}</h3>
                  <p className="line-clamp-1 overflow-hidden">
                    {novel.plot}
                    ㅂㅈㄱㅂㅈㄱㅂㅈㄱㅂㅈㄱㅂㅈㄱㅂㅈㄱㅂㅈㄱㅂㅈㄱㅂㅈㄱㅂㅈㄱㅂㅈㄱ
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mb-4">검색 결과가 없습니다.</p>
        )}
      </div>
      <Navbar />
    </div>
  );
}
