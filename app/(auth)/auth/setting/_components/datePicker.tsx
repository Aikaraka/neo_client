"use client";

import Select from "@/components/ui/select";
import { useController, useFormContext } from "react-hook-form";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);
const months = Array.from({ length: 12 }, (_, i) => i + 1);
const getDays = (year: number, month: number) =>
  Array.from({ length: new Date(year, month, 0).getDate() }, (_, i) => i + 1);

export default function DatePicker({ name }: { name: string }) {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
  } = useController({ name, control });

  const year = value ? Number(value.slice(0, 4)) : "";
  const month = value ? Number(value.slice(4, 6)) : "";
  const day = value ? Number(value.slice(6, 8)) : "";

  const handleChange = (
    type: "year" | "month" | "day",
    selectedValue: string
  ) => {
    const newYear = type === "year" ? selectedValue : year;
    const newMonth = type === "month" ? selectedValue : month;
    const newDay = type === "day" ? selectedValue : day;

    if (newYear && newMonth && newDay) {
      const formattedDate = `${newYear}${String(newMonth).padStart(
        2,
        "0"
      )}${String(newDay).padStart(2, "0")}`;
      onChange(formattedDate);
    }
  };

  return (
    <div className="flex gap-2 text-sm">
      <Select
        options={years}
        value={year}
        onChange={(e) => handleChange("year", e.target.value)}
        placeholder="출생년도"
      />
      <Select
        options={months}
        value={month}
        onChange={(e) => handleChange("month", e.target.value)}
        placeholder="월"
      />
      <Select
        options={year && month ? getDays(Number(year), Number(month)) : []}
        value={day}
        onChange={(e) => handleChange("day", e.target.value)}
        disabled={!year || !month}
        placeholder="일"
      />
    </div>
  );
}
