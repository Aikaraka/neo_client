import { z } from "zod";

export const RelationshipSchema = z.object({
  relationship: z.string().min(1, "관계를 입력해야 합니다."),
  targetName: z.string().min(1, "대상의 이름을 입력해야 합니다."),
});

export const CharacterSchema = z.object({
  name: z.string().min(1, "캐릭터 이름을 입력해주세요."),
  description: z.string().min(10, "캐릭터 설명은 10자 이상 입력해야 합니다."),
  relationships: z.array(RelationshipSchema),
  role: z.enum(["protagonist", "supporting"]),
  isConfirmed: z.boolean(),
  isEditing: z.boolean(),
});

export const createNovelSchema = z.object({
  characters: z
    .array(CharacterSchema)
    .min(1, "최소 한 명의 캐릭터가 필요합니다.")
    .refine(
      (characters) =>
        characters.filter((c) => c.role === "protagonist").length === 1,
      "1명의 주인공을 만들어주세요."
    ),
  title: z.string().min(5, "제목은 5자 이상을 입력해주세요."),
  plot: z.string().min(1, "스토리를 입력해야 합니다."),
  cover_image_url: z.string().optional(),
  background: z.object({
    // place: z.string().min(1, "배경 장소를 입력해야 합니다."),
    // time: z.string().min(1, "배경 시간을 입력해야 합니다."),
    // keywords: z
    //   .array(z.string())
    //   .min(1, "최소 한 개의 키워드를 입력해야 합니다."),
    description: z
      .string()
      .min(10, "배경 설명을 최소 10자 이상 입력해 주세요."),
    detailedLocations: z.array(z.string()).optional(),
  }),
  ending: z.enum(["happy", "sad", "open"]),
  mood: z.array(z.string()).min(1, "최소 한 개의 분위기를 선택해 주세요."),
  settings: z.object({
    hasViolence: z.boolean(),
    hasAdultContent: z.boolean(),
    isPublic: z.boolean(),
  }),
});

export type CreateNovelForm = z.infer<typeof createNovelSchema>;
export type CreateNovelFormFieldName = keyof CreateNovelForm;
