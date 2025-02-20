"use client";

import { useState } from "react";
import { Plus, X, Pencil } from "lucide-react";

interface BackgroundFormProps {
  background: {
    description: string;
    detailedLocations: string[];
  };
  setBackground: (background: {
    description: string;
    detailedLocations: string[];
  }) => void;
}

export function BackgroundForm({ background, setBackground }: BackgroundFormProps) {
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState("");

  const handleAddLocation = () => {
    if (!newLocation.trim()) return;
    
    setBackground({
      ...background,
      detailedLocations: [...background.detailedLocations, newLocation]
    });
    setNewLocation("");
    setShowAddLocation(false);
  };

  const handleRemoveLocation = (index: number) => {
    setBackground({
      ...background,
      detailedLocations: background.detailedLocations.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">배경 설명</label>
        <textarea
          value={background.description}
          onChange={(e) => setBackground({ ...background, description: e.target.value })}
          placeholder="소설의 배경을 자세히 설명해주세요..."
          className="w-full p-3 border rounded-lg"
          rows={4}
        />
        <p className="text-sm text-gray-500">
          최대한 상세하게 묘사할 수록 더 몰입감 있는 스토리 진행이 가능해요!
        </p>
        <p className="text-sm text-gray-500 italic">
          예시) 근미래형 디스토피아 도시 X<br />
          쓰레기더미가 쌓인 고층 건물 사이를 드론이 순찰하는 2090년 폐허가 된 메가시티 O
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">보다 상세한 주요 사건 발생지를 적고 싶으신가요?</span>
          <button
            onClick={() => setShowAddLocation(true)}
            className="text-primary hover:text-primary/80"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        {showAddLocation && (
          <div className="p-4 border rounded-lg space-y-3">
            <input
              type="text"
              value={newLocation}
              onChange={(e) => setNewLocation(e.target.value)}
              placeholder="주요 사건 발생지 입력"
              className="w-full p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddLocation(false)}
                className="px-3 py-1 text-sm"
              >
                취소
              </button>
              <button
                onClick={handleAddLocation}
                className="px-3 py-1 bg-primary text-white rounded-lg text-sm"
              >
                추가
              </button>
            </div>
          </div>
        )}

        {background.detailedLocations.map((location, index) => (
          <div key={index} className="p-4 border rounded-lg flex justify-between items-center">
            <span>{location}</span>
            <button
              onClick={() => handleRemoveLocation(index)}
              className="text-red-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}