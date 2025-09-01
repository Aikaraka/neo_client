"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { useFormContext } from "react-hook-form";
import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import AiAssistButton from "@/app/create/_components/aiAssist";

export function BackgroundForm() {
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const { setValue, watch } = useFormContext<CreateNovelForm>();
  const background = watch("background");

  const handleAddLocation = () => {
    if (!newLocation.trim()) return;

    setValue("background.detailedLocations", [
      ...(background.detailedLocations ?? []),
      newLocation,
    ]);
    setNewLocation("");
    setShowAddLocation(false);
  };

  const handleRemoveLocation = (index: number) => {
    if (background.detailedLocations?.length) {
      setValue("background.detailedLocations", [
        ...background.detailedLocations?.filter((_, i) => i !== index),
      ]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">첫 장면</label>
        <div className="w-full rounded-lg relative">
          <textarea
            value={background.start}
            onChange={(e) => setValue("background.start", e.target.value)}
            placeholder="여러분이 만든 세계관의 첫 장면은 어떻게 시작하시길 원하는지 적어주세요!"
            className="w-full border p-2"
            rows={4}
          />
          <AiAssistButton
            targetField="background.start"
            className="absolute bottom-2 right-2 z-10 bg-white border"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            주요 사건 발생지를 적고 싶으신가요?
          </span>
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

        {background.detailedLocations?.map((location, index) => (
          <div
            key={index}
            className="p-4 border rounded-lg flex justify-between items-center"
          >
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
