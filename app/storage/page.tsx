"use client";

import { useEffect, useState } from "react";
import { useSupabase, useUser } from "@/utils/supabase/authProvider";
import { useRouter } from "next/navigation";
import { Novel } from "@/types/novel";
import Image from "next/image";

export default function StoragePage() {
  const supabase = useSupabase();
  const user = useUser();
  const router = useRouter();
  const [novels, setNovels] = useState<Novel[]>([]);

  useEffect(() => {
    const fetchNovels = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from("novels")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching novels:", error);
        return;
      }

      setNovels(data || []);
    };

    fetchNovels();
  }, [supabase, user]);

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">내 소설 보관함</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {novels.map((novel) => (
          <div 
            key={novel.id} 
            className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => router.push(`/novel/${novel.id}/detail`)}
          >
            {novel.image_url ? (
              <div className="aspect-[2/3] mb-4">
                <Image
                  src={novel.image_url}
                  alt={novel.title}
                  width={300}
                  height={450}
                  className="rounded-lg object-cover w-full h-full"
                />
              </div>
            ) : (
              <div className="aspect-[2/3] mb-4 bg-gray-200 rounded-lg" />
            )}
            <h2 className="text-xl font-semibold mb-2">{novel.title}</h2>
            <p className="text-sm text-gray-600 mb-2">
              {novel.created_at.substring(0, 10)}
            </p>
            <div className="flex gap-2">
              {novel.mood?.map((mood, index) => (
                <span 
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary rounded text-sm"
                >
                  {mood}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}