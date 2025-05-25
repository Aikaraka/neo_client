import PaintIcon from "@/public/novel/chat/paint.svg";
import LightIcon from "@/public/novel/chat/light.svg";
import TextIcon from "@/public/novel/chat/text.svg";
import TextSizeIcon from "@/public/novel/chat/text-size.svg";
import LineHeightIcon from "@/public/novel/chat/line-height.svg";
import ParagraphSpacingIcon from "@/public/novel/chat/paragraph-spacing.svg";
import ParagraphWidthIcon from "@/public/novel/chat/paragraph-width.svg";
import ParagraphAlignmentIcon from "@/public/novel/chat/paragraph-alignment.svg";
import RefreshIcon from "@/public/novel/chat/refresh.svg";
import PlusIcon from "@/public/novel/chat/plus.svg";
import MinusIcon from "@/public/novel/chat/minus.svg";
import CaretDownIcon from "@/public/novel/chat/caret-down.svg";
import { useEffect, useRef, useState } from "react";

const colorList = [
  "#FFFFFF", "#F6F4EC", "#E5E4DF", "#3C3C3C", "#000000", "#2B3531", "#F8F7F3", "#D9D9D9"
];

export function ViewSettingsPanel({ onClose, onColorChange, selectedColor, fontSize, onFontSizeChange, lineHeight, onLineHeightChange, paragraphSpacing, onParagraphSpacingChange, paragraphWidth, onParagraphWidthChange }: {
  onClose: () => void,
  onColorChange?: (color: string) => void,
  selectedColor: string,
  fontSize: number,
  onFontSizeChange: (size: number) => void,
  lineHeight: number,
  onLineHeightChange: (lh: number) => void,
  paragraphSpacing: number,
  onParagraphSpacingChange: (ps: number) => void,
  paragraphWidth: number,
  onParagraphWidthChange: (width: number) => void,
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  // dirty 상태: 각 항목별로 관리
  const [dirty, setDirty] = useState({
    lineHeight: false,
    paragraphSpacing: false,
    paragraphWidth: false,
  });
  const [fontOpen, setFontOpen] = useState(false);
  const fontOptions = ["원본", "나눔고딕", "산돌고딕"];
  const [font, setFont] = useState("원본");
  const [alignOpen, setAlignOpen] = useState(false);
  const alignOptions = ["원본", "왼쪽", "가운데", "오른쪽"];
  const [align, setAlign] = useState("원본");
  const fontRef = useRef<HTMLDivElement>(null);
  const alignRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(selectedColor);

  // 모달 닫힐 때 dirty 초기화
  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      setDirty({ lineHeight: false, paragraphSpacing: false, paragraphWidth: false });
    };
  }, [onClose]);

  useEffect(() => {
    if (!fontOpen && !alignOpen) return;
    function handleClick(e: MouseEvent) {
      if (fontOpen && fontRef.current && !fontRef.current.contains(e.target as Node)) setFontOpen(false);
      if (alignOpen && alignRef.current && !alignRef.current.contains(e.target as Node)) setAlignOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [fontOpen, alignOpen]);

  useEffect(() => { setSelected(selectedColor); }, [selectedColor]);

  const dividerStyle = {
    border: "none",
    borderBottom: "1px solid #E2E1DC",
    marginLeft: 56,
    marginRight: 24,
    width: "auto",
    height: 0,
  };
  const thickDividerStyle = {
    border: "none",
    borderBottom: "2px solid #E2E1DC",
    width: "100%",
    margin: 0,
    height: 0,
  };
  const paintScrollStyle = {
    overflowX: "auto" as const,
    display: "flex",
    gap: 14,
    padding: "0 16px",
    scrollbarWidth: "none" as const,
    msOverflowStyle: "none" as const,
  };

  return (
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        bottom: 0,
        width: "100%",
        background: "#F5F5F5",
        borderRadius: "16px 16px 0 0",
        boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
        border: "1px solid #DBDBDB",
        zIndex: 100,
        padding: "24px 0 16px 0",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        opacity: visible ? 1 : 0,
        transition: "transform 0.35s cubic-bezier(.4,1.6,.6,1), opacity 0.3s"
      }}
    >
      {/* 페인트 위 얇은 선 */}
      <hr style={dividerStyle} />
      {/* 색상 선택 (가로 스크롤) */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginLeft: 24, marginTop: 8, marginBottom: 8 }}>
        <PaintIcon />
        <div
          style={{
            marginLeft: 16,
            marginRight: 0,
            overflowX: "auto",
            maxWidth: "calc(100% - 56px - 24px)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="hide-scrollbar"
        >
          <div style={{ display: "flex", gap: 20 }}>
            {colorList.map((color, i) => (
              <div
                key={color}
                onClick={() => {
                  setSelected(color);
                  if (onColorChange) onColorChange(color);
                }}
                style={{
                  width: 36, height: 36, borderRadius: "50%",
                  border: color === selected ? "2px solid #A259D9" : "1px solid #E2E1DC",
                  background: color, boxSizing: "border-box",
                  flex: "0 0 36px", cursor: "pointer"
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* 밝기-페인트 사이 얇은 구분선 */}
      <hr style={dividerStyle} />
      {/* 밝기 슬라이더 */}
      <div style={{ marginLeft: 24, marginTop: 24, marginBottom: 20, display: "flex", alignItems: "center", gap: 16 }}>
        <LightIcon />
        <div style={{ flex: 1, marginLeft: 16, marginRight: 24 }}>
          <div style={{ height: 4, background: "#E2E1DC", borderRadius: 2, position: "relative" }}>
            <div style={{ width: "60%", height: 4, background: "#A259D9", borderRadius: 2 }} />
            <div style={{ position: "absolute", left: "60%", top: -6, width: 16, height: 16, background: "#A259D9", borderRadius: "50%", border: "2px solid #fff" }} />
          </div>
        </div>
      </div>
      {/* 밝기 아래 두꺼운 구분선 */}
      <hr style={thickDividerStyle} />
      {/* 글꼴 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 24px 0 24px", minHeight: 48, position: "relative" }}>
        <TextIcon />
        <span style={{ flex: 1, fontSize: 17, color: "#868D96" }}>글꼴</span>
        <div ref={fontRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <button
            style={{
              color: "#868D96",
              fontSize: 17,
              fontWeight: 400,
              fontFamily: "inherit",
              background: "none",
              border: "none",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              lineHeight: 1
            }}
            onClick={() => setFontOpen(v => !v)}
          >
            {font}
            <CaretDownIcon style={{ marginLeft: 4, width: 22, height: 22, display: "block", verticalAlign: "middle", position: "relative", top: "8px" }} />
          </button>
          {fontOpen && (
            <div style={{
              position: "absolute", top: "100%", left: 0, background: "#fff", border: "1px solid #E2E1DC", borderRadius: 8, zIndex: 10, minWidth: 80
            }}>
              {fontOptions.map(opt => (
                <div key={opt} style={{ padding: 8, cursor: "pointer", color: opt === font ? "#A259D9" : "#232325" }} onClick={() => { setFont(opt); setFontOpen(false); }}>{opt}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <hr style={dividerStyle} />
      {/* 글자크기 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 24px 0 24px", minHeight: 48, position: "relative" }}>
        <TextSizeIcon />
        <span style={{ fontSize: 17, color: "#868D96" }}>글자크기</span>
        <span style={{ color: "#A9ABAE", fontWeight: 400, fontSize: 15, marginLeft: 8, marginRight: "auto" }}>{fontSize}</span>
        <div style={{
          width: 104, height: 28, border: "1px solid #A259D9", borderRadius: 9999,
          display: "flex", alignItems: "center", position: "relative", overflow: "hidden"
        }}>
          <button style={{
            flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", padding: 0
          }} onClick={() => onFontSizeChange(Math.max(10, fontSize - 1))}>
            <MinusIcon />
          </button>
          <div style={{
            width: 1, height: "100%", background: "#A259D9"
          }} />
          <button style={{
            flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", padding: 0
          }} onClick={() => onFontSizeChange(Math.min(30, fontSize + 1))}>
            <PlusIcon />
          </button>
        </div>
      </div>
      {/* 글자크기-줄간격 사이 굵은 구분선 */}
      <hr style={thickDividerStyle} />
      {/* 줄간격 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 24px 0 24px", minHeight: 48, position: "relative" }}>
        <LineHeightIcon />
        <span style={{ fontSize: 17, color: "#868D96" }}>줄간격</span>
        <span style={{ color: "#A9ABAE", fontWeight: 400, fontSize: 15, marginLeft: 8, marginRight: "auto" }}>{lineHeight}</span>
        {dirty.lineHeight && <RefreshIcon style={{ marginRight: 8, color: "#A259D9", width: 20, height: 20 }} />}
        <div style={{
          width: 104, height: 28, border: "1px solid #A259D9", borderRadius: 9999,
          display: "flex", alignItems: "center", position: "relative", overflow: "hidden"
        }}>
          <button style={{
            flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", padding: 0
          }} onClick={() => onLineHeightChange(Math.max(1.2, +(lineHeight - 0.1).toFixed(1)))}>
            <MinusIcon />
          </button>
          <div style={{
            width: 1, height: "100%", background: "#A259D9"
          }} />
          <button style={{
            flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", padding: 0
          }} onClick={() => onLineHeightChange(Math.min(2.4, +(lineHeight + 0.1).toFixed(1)))}>
            <PlusIcon />
          </button>
        </div>
      </div>
      <hr style={dividerStyle} />
      {/* 문단간격 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 24px 0 24px", minHeight: 48, position: "relative" }}>
        <ParagraphSpacingIcon />
        <span style={{ fontSize: 17, color: "#868D96" }}>문단 간격</span>
        <span style={{ color: "#A9ABAE", fontWeight: 400, fontSize: 15, marginLeft: 8, marginRight: "auto" }}>{paragraphSpacing}</span>
        {dirty.paragraphSpacing && <RefreshIcon style={{ marginRight: 8, color: "#A259D9", width: 20, height: 20 }} />}
        <div style={{
          width: 104, height: 28, border: "1px solid #A259D9", borderRadius: 9999,
          display: "flex", alignItems: "center", position: "relative", overflow: "hidden"
        }}>
          <button style={{
            flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", padding: 0
          }} onClick={() => onParagraphSpacingChange(Math.max(8, paragraphSpacing - 2))}>
            <MinusIcon />
          </button>
          <div style={{
            width: 1, height: "100%", background: "#A259D9"
          }} />
          <button style={{
            flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", padding: 0
          }} onClick={() => onParagraphSpacingChange(Math.min(40, paragraphSpacing + 2))}>
            <PlusIcon />
          </button>
        </div>
      </div>
      <hr style={dividerStyle} />
      {/* 문단너비 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 24px 0 24px", minHeight: 48, position: "relative" }}>
        <ParagraphWidthIcon />
        <span style={{ fontSize: 17, color: "#868D96" }}>문단 너비</span>
        <span style={{ color: "#A9ABAE", fontWeight: 400, fontSize: 15, marginLeft: 8, marginRight: "auto" }}>{paragraphWidth}</span>
        <div style={{
          width: 104, height: 28, border: "1px solid #A259D9", borderRadius: 9999,
          display: "flex", alignItems: "center", position: "relative", overflow: "hidden"
        }}>
          <button style={{
            flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", padding: 0
          }} onClick={() => onParagraphWidthChange(Math.max(300, paragraphWidth - 20))}>
            <MinusIcon />
          </button>
          <div style={{
            width: 1, height: "100%", background: "#A259D9"
          }} />
          <button style={{
            flex: 1, height: "100%", display: "flex", alignItems: "center", justifyContent: "center",
            background: "none", border: "none", cursor: "pointer", padding: 0
          }} onClick={() => onParagraphWidthChange(Math.min(800, paragraphWidth + 20))}>
            <PlusIcon />
          </button>
        </div>
      </div>
      <hr style={dividerStyle} />
      {/* 문단정렬 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 24px 0 24px", minHeight: 48, position: "relative" }}>
        <ParagraphAlignmentIcon />
        <span style={{ flex: 1, fontSize: 17, color: "#868D96" }}>문단 정렬</span>
        <div ref={alignRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <button
            style={{
              color: "#868D96",
              fontSize: 17,
              fontWeight: 400,
              fontFamily: "inherit",
              background: "none",
              border: "none",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              lineHeight: 1
            }}
            onClick={() => setAlignOpen(v => !v)}
          >
            {align}
            <CaretDownIcon style={{ marginLeft: 4, width: 20, height: 20, display: "block" }} />
          </button>
          {alignOpen && (
            <div style={{
              position: "absolute", top: "100%", left: 0, background: "#fff", border: "1px solid #E2E1DC", borderRadius: 8, zIndex: 10, minWidth: 80
            }}>
              {alignOptions.map(opt => (
                <div key={opt} style={{ padding: 8, cursor: "pointer", color: opt === align ? "#A259D9" : "#232325" }} onClick={() => { setAlign(opt); setAlignOpen(false); }}>{opt}</div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 