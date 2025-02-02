"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Character } from "@/types/novel";
import { CharacterForm } from "./components/CharacterForm";
import { RelationshipForm } from "./components/RelationshipForm";

export default function CreateNovel() {
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [plot, setPlot] = useState("");

  const handleNext = () => {
    if (characters.length === 0) {
      // TODO: 에러 메시지 표시
      return;
    }
    
    if (plot.trim() === "") {
      // TODO: 에러 메시지 표시
      return;
    }

    localStorage.setItem("novelCreationData", JSON.stringify({ characters, plot }));
    router.push("/create/background");
  };

  const validateCharacters = (characters: Character[]) => {
    // 주인공은 반드시 한 명이어야 함
    const protagonists = characters.filter(c => c.role === 'protagonist');
    if (protagonists.length !== 1) {
      throw new Error('주인공은 반드시 한 명이어야 합니다.');
    }
    
    // 최소 한 명의 등장인물이 필요
    const supporting = characters.filter(c => c.role === 'supporting');
    if (supporting.length === 0) {
      throw new Error('최소 한 명의 등장인물이 필요합니다.');
    }
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">소설 캐릭터와 줄거리</h1>
      
      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">캐릭터</h2>
        <CharacterForm characters={characters} setCharacters={setCharacters} />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">캐릭터 관계</h2>
        <RelationshipForm characters={characters} setCharacters={setCharacters} />
      </section>

      <section className="mb-8">
        <h2 className="text-xl font-semibold mb-4">줄거리</h2>
        <textarea
          className="w-full p-3 border rounded-lg"
          rows={6}
          value={plot}
          onChange={(e) => setPlot(e.target.value)}
          placeholder="소설의 전체적인 줄거리를 입력해주세요..."
        />
      </section>

      <button
        onClick={handleNext}
        className="w-full bg-primary text-white py-3 rounded-lg"
      >
        다음 단계로
      </button>
    </div>
  );
}