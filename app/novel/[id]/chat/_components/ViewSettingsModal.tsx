import React from "react";
import PaintIcon from "@/public/novel/chat/paint.svg";
import LightIcon from "@/public/novel/chat/light.svg";
import TextIcon from "@/public/novel/chat/text.svg";
import TextSizeIcon from "@/public/novel/chat/text-size.svg";
import LineHeightIcon from "@/public/novel/chat/line-height.svg";
import ParagraphSpacingIcon from "@/public/novel/chat/paragraph-spacing.svg";
import ParagraphWidthIcon from "@/public/novel/chat/paragraph-width.svg";
import ParagraphAlignmentIcon from "@/public/novel/chat/paragraph-alignment.svg";

export function ViewSettingsModal() {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: -320, // 필요에 따라 조정
        margin: "0 auto",
        width: 360,
        height: 300,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        border: "1px solid #DBDBDB",
        zIndex: 50,
      }}
    >
      {/* 색상 선택 (PaintIcon) */}
      <div style={{ position: "absolute", left: 9, top: 14, width: 344, height: 27, display: "flex", alignItems: "center" }}>
        <PaintIcon />
        {/* ...색상 선택 UI 자리... */}
      </div>
      {/* 밝기 (LightIcon) */}
      <div style={{ position: "absolute", left: 9, top: 55, width: 320, height: 16, display: "flex", alignItems: "center" }}>
        <LightIcon />
        {/* ...밝기 슬라이더 자리... */}
      </div>
      {/* 구분선 */}
      <div style={{ position: "absolute", left: -26, top: 79, width: 415, height: 2, background: "#E2E1DC" }} />
      <div style={{ position: "absolute", left: -26, top: 146, width: 415, height: 2, background: "#E2E1DC" }} />
      {/* 글꼴 (TextIcon) */}
      <div style={{ position: "absolute", left: 9, top: 89, width: 335, height: 16, display: "flex", alignItems: "center" }}>
        <TextIcon />
        {/* ...글꼴 선택 자리... */}
      </div>
      {/* 글자크기 (TextSizeIcon) */}
      <div style={{ position: "absolute", left: 9, top: 118, width: 323, height: 22, display: "flex", alignItems: "center" }}>
        <TextSizeIcon />
        {/* ...글자크기 컨트롤 자리... */}
      </div>
      {/* 줄간격 (LineHeightIcon) */}
      <div style={{ position: "absolute", left: 9, top: 155, width: 323, height: 22, display: "flex", alignItems: "center" }}>
        <LineHeightIcon />
        {/* ...줄간격 컨트롤 자리... */}
      </div>
      {/* 문단간격 (ParagraphSpacingIcon) */}
      <div style={{ position: "absolute", left: 9, top: 190, width: 323, height: 22, display: "flex", alignItems: "center" }}>
        <ParagraphSpacingIcon />
        {/* ...문단간격 컨트롤 자리... */}
      </div>
      {/* 문단너비 (ParagraphWidthIcon) */}
      <div style={{ position: "absolute", left: 9, top: 225, width: 323, height: 22, display: "flex", alignItems: "center" }}>
        <ParagraphWidthIcon />
        {/* ...문단너비 컨트롤 자리... */}
      </div>
      {/* 문단정렬 (ParagraphAlignmentIcon) */}
      <div style={{ position: "absolute", left: 9, top: 262, width: 335, height: 16, display: "flex", alignItems: "center" }}>
        <ParagraphAlignmentIcon />
        {/* ...문단정렬 컨트롤 자리... */}
      </div>
    </div>
  );
} 