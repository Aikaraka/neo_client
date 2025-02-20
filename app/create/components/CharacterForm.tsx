"use client";

import { Character } from "@/types/novel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import { useState } from "react";

interface CharacterFormProps {
  characters: Character[];
  setCharacters: (characters: Character[]) => void;
}

interface DraftCharacter extends Character {
  isConfirmed: boolean;
}

export function CharacterForm({ characters, setCharacters }: CharacterFormProps) {
  const [draftCharacters, setDraftCharacters] = useState<DraftCharacter[]>([]);

  const addDraftCharacter = () => {
    setDraftCharacters([
      ...draftCharacters,
      {
        name: "",
        description: "",
        relationships: [],
        role: "supporting",
        isConfirmed: false
      }
    ]);
  };

  const updateDraftCharacter = (index: number, updatedCharacter: Partial<DraftCharacter>) => {
    const newDraftCharacters = [...draftCharacters];
    newDraftCharacters[index] = { ...newDraftCharacters[index], ...updatedCharacter };
    setDraftCharacters(newDraftCharacters);
  };

  const deleteDraftCharacter = (index: number) => {
    setDraftCharacters(draftCharacters.filter((_, i) => i !== index));
  };

  const confirmCharacter = (index: number) => {
    const character = draftCharacters[index];
    if (!character.name || !character.description) {
      alert("캐릭터 이름과 설명을 모두 입력해주세요.");
      return;
    }
    
    // 주인공이 이미 있는데 또 주인공을 추가하려는 경우
    if (character.role === 'protagonist' && 
        characters.some(c => c.role === 'protagonist')) {
      alert("주인공은 한 명만 설정할 수 있습니다.");
      return;
    }

    updateDraftCharacter(index, { isConfirmed: true });
    setCharacters([...characters, {
      name: character.name,
      description: character.description,
      relationships: [],
      role: character.role
    }]);
  };

  return (
    <div className="space-y-4">
      {draftCharacters.map((character, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          {!character.isConfirmed ? (
            <>
              <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                  <label className="text-sm font-medium">캐릭터 이름</label>
                  <Input
                    value={character.name}
                    onChange={(e) => updateDraftCharacter(index, { name: e.target.value })}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteDraftCharacter(index)}
                  className="text-destructive"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">역할</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`role-${index}`}
                      value="protagonist"
                      checked={character.role === 'protagonist'}
                      onChange={(e) => updateDraftCharacter(index, { 
                        role: e.target.value as 'protagonist' | 'supporting' 
                      })}
                    />
                    주인공 (플레이어 캐릭터)
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`role-${index}`}
                      value="supporting"
                      checked={character.role === 'supporting'}
                      onChange={(e) => updateDraftCharacter(index, { 
                        role: e.target.value as 'protagonist' | 'supporting' 
                      })}
                    />
                    등장인물
                  </label>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">캐릭터 설명</label>
                <Input
                  value={character.description}
                  onChange={(e) => updateDraftCharacter(index, { description: e.target.value })}
                  placeholder="캐릭터의 성격, 외모, 특징 등을 자유롭게 설명해주세요."
                />
              </div>

              <Button
                type="button"
                onClick={() => confirmCharacter(index)}
                className="w-full bg-primary text-white"
              >
                캐릭터 추가 완료
              </Button>
            </>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="font-medium">{character.name}</div>
              <div className="text-sm text-gray-600 mt-1">{character.description}</div>
              <div className="text-sm text-primary mt-1">
                {character.role === 'protagonist' ? '주인공' : '등장인물'}
              </div>
            </div>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={addDraftCharacter}
        disabled={draftCharacters.some(c => !c.isConfirmed)}
      >
        새 캐릭터 추가
      </Button>
    </div>
  );
}