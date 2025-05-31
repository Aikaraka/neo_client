"use client";

import { useStoryContext } from "@/app/novel/[id]/chat/_components/storyProvider";
import ProgressRate from "@/app/novel/[id]/chat/_components/ProgressRate";
import { StoryContent } from "@/app/novel/[id]/chat/_components/StoryContent";
import { ChatInput } from "@/app/novel/[id]/chat/_components/ChatInput";
import NotFound from "@/app/[...404]/page";
import { useState, useEffect } from "react";

export default function ChatPage() {
  const { initError } = useStoryContext();
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [fontSize, setFontSize] = useState(15);
  const [lineHeight, setLineHeight] = useState(1.6);
  const [paragraphSpacing, setParagraphSpacing] = useState(16);
  const [paragraphWidth, setParagraphWidth] = useState(600);
  const [brightness, setBrightness] = useState(1);
  const [align, setAlign] = useState<"left" | "center">("left");
  useEffect(() => {
    const stored = localStorage.getItem("novel_brightness");
    if (stored) setBrightness(Number(stored));
  }, []);
  useEffect(() => {
    localStorage.setItem("novel_brightness", String(brightness));
  }, [brightness]);
  const darkColors = ["#3C3C3C", "#000000", "#2B3531"];
  const isDark = darkColors.includes(bgColor);

  if (initError) return <NotFound />;
  return (
    <div
      className="flex flex-col w-full h-full"
      style={{
        background: bgColor,
        color: isDark ? "#fff" : "#232325",
        transition: "background 0.2s, color 0.2s",
        filter: `brightness(${brightness})`
      }}
    >
      <ProgressRate />
      <StoryContent />
      <ChatInput
        onColorChange={setBgColor}
        selectedColor={bgColor}
        fontSize={fontSize}
        lineHeight={lineHeight}
        paragraphSpacing={paragraphSpacing}
        paragraphWidth={paragraphWidth}
        onFontSizeChange={setFontSize}
        onLineHeightChange={setLineHeight}
        onParagraphSpacingChange={setParagraphSpacing}
        onParagraphWidthChange={setParagraphWidth}
        brightness={brightness}
        onBrightnessChange={setBrightness}
        align={align}
        onAlignChange={setAlign}
      />
    </div>
  );
}
