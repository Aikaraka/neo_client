"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NovelCreationData } from "@/types/novel";
import { BackgroundForm } from "../components/BackgroundForm";
import { EndingSelector } from "../components/EndingSelector";
import { MoodSelector } from "../components/MoodSelector";

export default function BackgroundPage() {
  const router = useRouter();
  const [background, setBackground] = useState<NovelCreationData["background"]>({
    place: "",
    time: "",
    keywords: [],
    description: "",
    detailedLocations: [],
  });
  const [ending, setEnding] = useState<'happy' | 'sad' | 'open'>('happy');
  const [mood, setMood] = useState<string[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem("novelCreationData");
    if (savedData) {
      const parsedData = JSON.parse(savedData) as Partial<NovelCreationData>;
      if (parsedData.background) {
        setBackground(parsedData.background);
      }
      if (parsedData.ending) {
        setEnding(parsedData.ending);
      }
      if (parsedData.mood) {
        setMood(parsedData.mood);
      }
    }
  }, []);

  const handleNext = () => {
    const savedData = localStorage.getItem("novelCreationData");
    const existingData = savedData ? JSON.parse(savedData) : {};
    
    localStorage.setItem("novelCreationData", JSON.stringify({
      ...existingData,
      background,
      ending,
      mood,
    }));
    
    router.push("/create/settings");
  };

  return (
    <div className="container max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">배경 설정</h1>
      
      <section className="space-y-8 mb-8">
        <BackgroundForm 
          background={background} 
          setBackground={setBackground} 
        />
        
        <EndingSelector 
          ending={ending} 
          setEnding={setEnding} 
        />
        
        <MoodSelector 
          mood={mood} 
          setMood={setMood} 
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