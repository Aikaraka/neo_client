"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useSupabase } from "@/utils/supabase/authProvider";
import { Novel } from "@/types/novel";
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
  const params = useParams();
  const supabase = useSupabase();
  const [novel, setNovel] = useState<Novel | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNovel = async () => {
      try {
        const { data, error } = await supabase
          .from("novels")
          .select("*")
          .eq("id", params.id)
          .single();

        if (error) throw error;
        setNovel(data);
      } catch (error) {
        console.error("Error fetching novel:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNovel();
  }, [params.id, supabase]);

  if (loading) return <div>로딩 중...</div>;
  if (!novel) return <div>소설을 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-background pb-20 relative">
      <div className="container max-w-4xl mx-auto p-4">
        <div className="flex gap-6">
          {novel.image_url ? (
            <Image
              src={novel.image_url}
              alt={novel.title}
              width={192}
              height={256}
              className="rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-48 h-64 bg-gray-200 rounded-lg shrink-0" />
          )}
          
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-bold">{novel.title}</h1>
            
            <div className="flex gap-2">
              {novel.mood.map((tag, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold">줄거리</h2>
              <p className="text-gray-600">{novel.plot}</p>
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold">등장인물</h2>
              {novel.characters.map((char, index) => (
                <div key={index} className="p-2 bg-gray-50 rounded">
                  <span className="font-medium">{char.name}</span>
                  <p className="text-sm text-gray-600">{char.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h2 className="font-semibold">배경 설명</h2>
              <p className="text-gray-600">{novel.background.description}</p>
              {novel.background.detailedLocations.map((location, index) => (
                <div key={index} className="text-sm text-gray-600">
                  • {location}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
