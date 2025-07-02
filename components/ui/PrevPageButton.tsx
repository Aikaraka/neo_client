"use client";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

const PrevPageButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<"button"> & {
    iconSize?: number;
  }
>(({ className, iconSize, ...props }, ref) => {
  const router = useRouter();
  return (
    <button
      ref={ref}
      onClick={() => router.back()}
      className={cn(
        "p-2 rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center",
        className
      )}
      {...props}
    >
      <ChevronLeftIcon size={iconSize ?? 24} />
    </button>
  );
});

PrevPageButton.displayName = "PrevPageButton";

export default PrevPageButton;
