"use server";
import { createNovelSchema } from "@/app/create/_schema/createNovelSchema";
import { createClient } from "@/utils/supabase/server";
import { z } from "zod";

export async function createNovel(novel: z.infer<typeof createNovelSchema>) {
  const supabase = await createClient();
  console.log(novel);
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (!user || userError) throw new Error("유저 정보를 찾지 못했습니다.");

  const { data, error: insertError } = await supabase
    .from("novels")
    .insert([
      {
        user_id: user.id,
        title: novel.title,
        image_url: novel.cover_image_url ?? "",
        settings: novel.settings,
        characters:
          novel.characters.length > 0
            ? novel.characters.map((character) => {
                const age =
                  character.age === 0 ? "미정" : character.age.toString();
                return {
                  ...character,
                  age: age,
                };
              })
            : "{}",
        plot: novel.plot || "",
        background: {
          start: novel.background.start || "",
          detailedLocations: novel.background.detailedLocations || "{}",
        },
        ending: novel.ending || "happy",
        mood: novel.mood || "{}",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (insertError) throw new Error("소설 업로드 중 오류가 발생했습니다.");
  return data.id;
}
