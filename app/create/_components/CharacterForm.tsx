"use client";

import { Character, Gender } from "@/types/novel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Pencil, Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFormContext } from "react-hook-form";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { Label } from "@/components/ui/label";
import { getAIAssist } from "@/app/create/_api/aiAssist.server";
import { useState } from "react";

interface ExtendedCharacter extends Character {
  isConfirmed: boolean;
  isEditing: boolean;
}

const TOAST_TITLE_CHARACTER_ERROR = "캐릭터 생성 오류";

export function CharacterForm() {
  const { setValue, watch, formState } = useFormContext<CreateNovelForm>();
  const characters = watch("characters");
  const [isAILoading, setIsAILoading] = useState<number | null>(null);

  const { toast } = useToast();

  const addCharacter = () => {
    setValue("characters", [
      ...characters,
      {
        name: "",
        description: "",
        relationships: [],
        role: "supporting",
        isConfirmed: false,
        isEditing: true,
        gender: "NONE",
        age: 1,
      },
    ]);
  };

  const updateCharacter = (
    index: number,
    updatedFields: Partial<ExtendedCharacter>
  ) => {
    const newCharacters = [...characters];
    newCharacters[index] = { ...newCharacters[index], ...updatedFields };
    setValue("characters", newCharacters);
  };

  const deleteCharacter = (index: number) => {
    setValue(
      "characters",
      characters.filter((_, i) => i !== index)
    );
  };

  const confirmCharacter = (index: number) => {
    const character = characters[index];
    if (!character.name || !character.description) {
      toast({
        title: TOAST_TITLE_CHARACTER_ERROR,
        description: "캐릭터 이름과 설명을 모두 입력해주세요.",
      });
      return;
    }

    if (character.description.length < 10) {
      toast({
        title: TOAST_TITLE_CHARACTER_ERROR,
        description: "캐릭터의 설명은 10자 이상으로 입력해주세요.",
      });
      return;
    }

    if (
      character.role === "protagonist" &&
      characters.some((c, i) => c.role === "protagonist" && i !== index)
    ) {
      toast({
        title: TOAST_TITLE_CHARACTER_ERROR,
        description: "주인공은 한 명만 설정할 수 있습니다.",
      });
      return;
    }
    if (character.age < 0 && character.age > 9999) {
      toast({
        title: TOAST_TITLE_CHARACTER_ERROR,
        description: "나이는 0~9999 사이의 숫자로 입력해주세요.",
      });
      return;
    }

    updateCharacter(index, { isConfirmed: true, isEditing: false });
  };

  const editCharacter = (index: number) => {
    updateCharacter(index, { isEditing: true });
  };

  const handleAIAssist = async (index: number) => {
    try {
      setIsAILoading(index);
      
      // 깊은 복사를 통해 임시 characters 배열 생성
      const tempCharacters = characters.map(char => ({
        ...char,
        relationships: [...char.relationships]
      }));
      
      // 현재 입력 중인 캐릭터 정보를 임시 배열에 반영
      const currentCharacter = tempCharacters[index];
      
      const response = await getAIAssist({
        formData: {
          characters: tempCharacters,  // 전체 캐릭터 배열 전달
          title: watch("title"),
          plot: watch("plot")
        },
        targetField: "characters",
        characterIndex: index
      });
      
      updateCharacter(index, { description: response.content });
    } catch (error) {
      toast({
        title: "AI 어시스트 오류",
        description: error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsAILoading(null);
    }
  };

  return (
    <>
      <Button
        type="button"
        variant="default"
        onClick={addCharacter}
        disabled={characters.some((c) => !c.isConfirmed)}
        className="absolute top-0 right-5 rounded-full w-10 h-10"
      >
        <Plus className="text-white" />
      </Button>
      <div className="flex flex-col">
        {characters.map((character, index) => (
          <div key={index} className="px-2 rounded-lg">
            {character.isEditing ? (
              <div className="space-y-4 border p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <label className="text-sm font-medium">캐릭터 이름</label>
                    <Input
                      value={character.name}
                      onChange={(e) =>
                        updateCharacter(index, { name: e.target.value })
                      }
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteCharacter(index)}
                    className="text-destructive"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-2 flex justify-between items-center">
                  <div className="flex flex-col gap-2">
                    <Label>성별</Label>
                    <div className="flex gap-2">
                      <input
                        type="radio"
                        value={"MALE"}
                        checked={character.gender === "MALE"}
                        onChange={(e) =>
                          updateCharacter(index, {
                            gender: e.target.value as Gender,
                          })
                        }
                      />
                      <label>남자</label>
                      <input
                        type="radio"
                        value={"FEMALE"}
                        checked={character.gender === "FEMALE"}
                        onChange={(e) =>
                          updateCharacter(index, {
                            gender: e.target.value as Gender,
                          })
                        }
                      />
                      <label>여자</label>
                      <input
                        type="radio"
                        value={"NONE"}
                        checked={character.gender === "NONE"}
                        onChange={(e) =>
                          updateCharacter(index, {
                            gender: e.target.value as Gender,
                          })
                        }
                      />
                      <label>없음</label>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>나이</Label>
                  <Input
                    className="w-20"
                    type="number"
                    min={0}
                    max={9999}
                    value={character.age}
                    onChange={(e) =>
                      updateCharacter(index, { age: +e.target.value })
                    }
                  />
                  <p className="text-sm text-gray-500 pl-1">
                    나이를 0으로 입력하면 미정으로 설정됩니다.
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">역할</label>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`role-${index}`}
                        value="protagonist"
                        checked={character.role === "protagonist"}
                        onChange={(e) =>
                          updateCharacter(index, {
                            role: e.target.value as
                              | "protagonist"
                              | "supporting",
                          })
                        }
                      />
                      주인공 (플레이어 캐릭터)
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`role-${index}`}
                        value="supporting"
                        checked={character.role === "supporting"}
                        onChange={(e) =>
                          updateCharacter(index, {
                            role: e.target.value as
                              | "protagonist"
                              | "supporting",
                          })
                        }
                      />
                      등장인물
                    </label>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">캐릭터 설명</label>
                  <div className="relative">
                    <Input
                      value={character.description}
                      onChange={(e) =>
                        updateCharacter(index, {
                          description: e.target.value,
                        })
                      }
                      placeholder="캐릭터의 성격, 외모, 특징 등을 자유롭게 설명해주세요."
                    />
                    <button
                      type="button"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                      onClick={() => handleAIAssist(index)}
                      disabled={isAILoading !== null}
                    >
                      {isAILoading === index ? "생성 중..." : "AI"}
                    </button>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => confirmCharacter(index)}
                  className="w-full bg-primary text-white"
                >
                  {character.isConfirmed ? "수정 완료" : "캐릭터 추가 완료"}
                </Button>
              </div>
            ) : (
              <div className="p-4 relative border-b flex flex-col gap-2">
                <div className="text-sm font-bold">
                  {character.role === "protagonist" ? "주인공" : "등장인물"}
                </div>
                <div className="flex w-full flex-wrap gap-2">
                  <div className="w-[20%] break-words">{character.name}</div>
                  <p className="w-[70%] break-words">{character.description}</p>
                </div>

                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => editCharacter(index)}
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 rounded-full"
                >
                  <Pencil className="w-3 h-3 text-primary" />
                </Button>
              </div>
            )}
          </div>
        ))}
        <p className="text-destructive">
          {formState.errors.characters?.message}
        </p>
      </div>
    </>
  );
}
