"use client";

import { CreateNovelForm } from "@/app/create/_schema/createNovelSchema";
import { useFormContext } from "react-hook-form";

const endings = [
  { value: "happy", label: "해피엔딩" },
  { value: "sad", label: "새드엔딩" },
  { value: "open", label: "열린 결말" },
];
type EndingType = "happy" | "sad" | "open";

export function EndingSelector() {
  const { setValue, watch } = useFormContext<CreateNovelForm>();
  const ending = watch("ending");

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium mb-3">결말 선택</h3>
      <div className="grid grid-cols-3 gap-2">
        {endings.map((item) => (
          <button
            key={item.value}
            onClick={() => setValue("ending", item.value as EndingType)}
            className={`p-2 rounded-lg border ${
              ending === item.value
                ? "bg-primary text-white"
                : "bg-white hover:bg-gray-50"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
