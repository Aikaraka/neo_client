"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import AiAssistButton from "@/app/create/_components/aiAssist";

export function RelationshipForm() {
  const { watch, setValue } = useFormContext<CreateNovelForm>();
  const characters = watch("characters");
  const [selectedCharacter1, setSelectedCharacter1] = useState<number>(-1);
  const [selectedCharacter2, setSelectedCharacter2] = useState<number>(-1);
  const [relationship1to2, setRelationship1to2] = useState("");
  const [relationship2to1, setRelationship2to1] = useState("");
  const [editingRelation, setEditingRelation] = useState<{
    char1Index: number;
    char2Index: number;
  } | null>(null);

  // 특정 캐릭터가 다른 모든 캐릭터와 관계가 설정되어 있는지 확인
  const hasAllRelationships = (charIndex: number) => {
    const char = characters[charIndex];
    const otherCharsCount = characters.length - 1;
    const relationshipsCount = char.relationships.length;
    return relationshipsCount >= otherCharsCount;
  };

  // 두 캐릭터 간의 관계가 이미 존재하는지 확인
  const relationshipExists = (char1Index: number, char2Index: number) => {
    if (char1Index === -1 || char2Index === -1) return false;

    const char1 = characters[char1Index];
    return char1.relationships.some(
      (rel) => rel.targetName === characters[char2Index].name
    );
  };

  // 캐릭터 선택 옵션 필터링
  const getAvailableCharacters = (
    excludeIndex: number,
    selectedChar: number
  ) => {
    return characters.map((char, idx) => ({
      value: idx,
      label: char.name,
      disabled:
        idx === excludeIndex ||
        (selectedChar !== -1 && relationshipExists(selectedChar, idx)) ||
        (selectedChar === -1 && hasAllRelationships(idx)),
    }));
  };

  // 관계 수정 시작
  const handleEditRelation = (char1Index: number, char2Index: number) => {
    const char1 = characters[char1Index];
    const char2 = characters[char2Index];

    const relation1to2 = char1.relationships.find(
      (rel) => rel.targetName === char2.name
    );
    const relation2to1 = char2.relationships.find(
      (rel) => rel.targetName === char1.name
    );

    setSelectedCharacter1(char1Index);
    setSelectedCharacter2(char2Index);
    setRelationship1to2(relation1to2?.relationship || "");
    setRelationship2to1(relation2to1?.relationship || "");
    setEditingRelation({ char1Index, char2Index });
  };

  const handleAddOrUpdateRelationship = () => {
    if (
      selectedCharacter1 === -1 ||
      selectedCharacter2 === -1 ||
      !relationship1to2.trim() ||
      !relationship2to1.trim()
    ) {
      return;
    }

    const updatedCharacters = [...characters];

    updatedCharacters[selectedCharacter1].relationships = updatedCharacters[
      selectedCharacter1
    ].relationships.filter(
      (rel) => rel.targetName !== characters[selectedCharacter2].name
    );
    updatedCharacters[selectedCharacter2].relationships = updatedCharacters[
      selectedCharacter2
    ].relationships.filter(
      (rel) => rel.targetName !== characters[selectedCharacter1].name
    );

    updatedCharacters[selectedCharacter1].relationships.push({
      targetName: characters[selectedCharacter2].name,
      relationship: relationship1to2,
    });
    updatedCharacters[selectedCharacter2].relationships.push({
      targetName: characters[selectedCharacter1].name,
      relationship: relationship2to1,
    });

    // setCharacters 대신 setValue 사용
    setValue("characters", updatedCharacters);
    setSelectedCharacter1(-1);
    setSelectedCharacter2(-1);
    setRelationship1to2("");
    setRelationship2to1("");
    setEditingRelation(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <select
          value={selectedCharacter1}
          onChange={(e) => setSelectedCharacter1(Number(e.target.value))}
          className="p-2 border rounded-lg"
          disabled={editingRelation !== null}
        >
          <option value={-1}>캐릭터 선택</option>
          {getAvailableCharacters(selectedCharacter2, -1).map(
            ({ value, label, disabled }) => (
              <option key={value} value={value} disabled={disabled}>
                {label}
              </option>
            )
          )}
        </select>

        <select
          value={selectedCharacter2}
          onChange={(e) => setSelectedCharacter2(Number(e.target.value))}
          className="p-2 border rounded-lg"
          disabled={editingRelation !== null}
        >
          <option value={-1}>캐릭터 선택</option>
          {getAvailableCharacters(selectedCharacter1, selectedCharacter1).map(
            ({ value, label, disabled }) => (
              <option key={value} value={value} disabled={disabled}>
                {label}
              </option>
            )
          )}
        </select>
      </div>

      {selectedCharacter1 !== -1 && selectedCharacter2 !== -1 && (
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold">
              {characters[selectedCharacter1].name}이(가){" "}
              {characters[selectedCharacter2].name}을(를) 바라보는 관계
            </label>
            <textarea
              value={relationship1to2}
              onChange={(e) => setRelationship1to2(e.target.value)}
              placeholder="관계를 설명해주세요..."
              className="w-full p-2 border rounded-lg"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold">
              {characters[selectedCharacter2].name}이(가){" "}
              {characters[selectedCharacter1].name}을(를) 바라보는 관계
            </label>
            <textarea
              value={relationship2to1}
              onChange={(e) => setRelationship2to1(e.target.value)}
              placeholder="관계를 설명해주세요..."
              className="w-full p-2 border rounded-lg"
              rows={2}
            />
          </div>
        </div>
      )}

      <button
        onClick={handleAddOrUpdateRelationship}
        disabled={
          selectedCharacter1 === -1 ||
          selectedCharacter2 === -1 ||
          !relationship1to2.trim() ||
          !relationship2to1.trim()
        }
        className="w-full py-2 bg-primary text-white rounded-lg disabled:opacity-50"
      >
        {editingRelation ? "관계 수정하기" : "관계 추가하기"}
      </button>

      {/* 관계 목록 표시 */}
      <div className="mt-4 space-y-2">
        {characters.map((char1, char1Index) =>
          char1.relationships.map((rel, relIndex) => {
            const char2Index = characters.findIndex(
              (c) => c.name === rel.targetName
            );
            return (
              <div
                key={`${char1.name}-${rel.targetName}-${relIndex}`}
                className="p-2 bg-gray-50 rounded-lg text-sm flex justify-between items-center"
              >
                <span className="px-2">
                  <span className="font-medium">{char1.name}</span> ➔{" "}
                  <span className="font-medium">{rel.targetName}</span>:{" "}
                  {rel.relationship}
                </span>
                <div className="flex items-center gap-3">
                  <AiAssistButton
                    targetField="relationships"
                    relationshipIndex={relIndex}
                    characterIndex={char1Index}
                  />
                  <button
                    onClick={() => handleEditRelation(char1Index, char2Index)}
                    className="text-gray-500 hover:text-primary"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
