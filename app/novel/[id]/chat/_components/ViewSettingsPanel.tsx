import PaintIcon from "@/public/novel/chat/paint.svg";
import LightIcon from "@/public/novel/chat/light.svg";
import TextIcon from "@/public/novel/chat/text.svg";
import TextSizeIcon from "@/public/novel/chat/text-size.svg";
import LineHeightIcon from "@/public/novel/chat/line-height.svg";
import ParagraphSpacingIcon from "@/public/novel/chat/paragraph-spacing.svg";
import ParagraphWidthIcon from "@/public/novel/chat/paragraph-width.svg";
import RefreshIcon from "@/public/novel/chat/refresh.svg";
import PlusIcon from "@/public/novel/chat/plus.svg";
import MinusIcon from "@/public/novel/chat/minus.svg";
import CaretDownIcon from "@/public/novel/chat/caret-down.svg";
import { useEffect, useRef, useState } from "react";

const colorList = [
  "#FFFFFF", "#F6F4EC", "#E5E4DF", "#3C3C3C", "#000000", "#2B3531", "#F8F7F3", "#D9D9D9"
];

const DEFAULT_FONT_SIZE = 15;
const DEFAULT_LINE_HEIGHT = 1.6;
const DEFAULT_PARAGRAPH_SPACING = 16;

export function ViewSettingsPanel({ onClose, onColorChange, selectedColor, fontSize, onFontSizeChange, lineHeight, onLineHeightChange, paragraphSpacing, onParagraphSpacingChange, paragraphWidth, onParagraphWidthChange, brightness, onBrightnessChange, font, onFontChange, panelStyle }: {
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
  brightness: number,
  onBrightnessChange: (b: number) => void,
  font: string,
  onFontChange: (font: string) => void,
  panelStyle?: React.CSSProperties,
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [fontOpen, setFontOpen] = useState(false);
  const fontOptions = ["나눔명조", "나눔고딕", "KoPubWorld 돋움체", "KoPubWorld 바탕체"];
  const fontRef = useRef<HTMLDivElement>(null);
  const [selected, setSelected] = useState(selectedColor);
  const [isMobile, setIsMobile] = useState(true);
  
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 350);
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setTimeout(() => setVisible(true), 10);
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        handleClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  useEffect(() => {
    if (!fontOpen) return;
    function handleClick(e: MouseEvent) {
      if (fontOpen && fontRef.current && !fontRef.current.contains(e.target as Node)) setFontOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [fontOpen]);

  useEffect(() => { setSelected(selectedColor); }, [selectedColor]);

  const dividerStyle = {
    border: "none",
    borderBottom: "1px solid #E2E1DC",
    marginLeft: isMobile ? 56 : 56,
    marginRight: isMobile ? 24 : 24,
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

  const getTransformValue = () => {
    if (isClosing) return "100%";
    return visible ? "0" : "100%";
  };

  return (
    <div
      ref={panelRef}
      style={
        isMobile
          ? {
              position: "fixed",
              left: "50%",
              bottom: 0,
              width: "100%",
              maxWidth: "100%",
              transform: `translate(-50%, ${getTransformValue()})`,
              background: "#F5F5F5",
              borderRadius: "16px 16px 0 0",
              boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
              border: "1px solid #DBDBDB",
              zIndex: 100,
              padding: "24px 0 16px 0",
              opacity: isClosing ? 0 : (visible ? 1 : 0),
              transition: "transform 0.35s cubic-bezier(.4,1.6,.6,1), opacity 0.3s",
              maxHeight: "80vh",
              overflowY: "auto",
            }
          : (panelStyle && Object.keys(panelStyle).length > 0
              ? { ...panelStyle }
              : {
                  position: "fixed",
                  left: "50%",
                  bottom: 0,
                  width: 600,
                  maxWidth: "100%",
                  transform: `translate(-50%, ${getTransformValue()})`,
                  background: "#fff",
                  borderRadius: "16px 16px 0 0",
                  boxShadow: "0 -4px 24px rgba(0,0,0,0.08)",
                  border: "1px solid #DBDBDB",
                  zIndex: 100,
                  padding: "24px 0 16px 0",
                  opacity: isClosing ? 0 : (visible ? 1 : 0),
                  transition: "transform 0.35s cubic-bezier(.4,1.6,.6,1), opacity 0.3s",
                  maxHeight: "80vh",
                  overflowY: "auto",
                  color: "#232325",
                }
            )
      }
    >
      {/* 페인트 위 얇은 선 */}
      <hr style={dividerStyle} />
      {/* 색상 선택 (가로 스크롤) */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: isMobile ? 16 : 16, 
        marginLeft: isMobile ? 24 : 24, 
        marginTop: 8, 
        marginBottom: 8 
      }}>
        <PaintIcon style={{ width: isMobile ? 16 : 16, height: isMobile ? 16 : 16 }} />
        <div
          style={{
            marginLeft: isMobile ? 16 : 16,
            marginRight: 0,
            overflowX: "auto",
            maxWidth: isMobile ? "calc(100% - 56px - 24px)" : "calc(100% - 56px - 24px)",
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
          className="hide-scrollbar"
        >
          <div style={{ display: "flex", gap: isMobile ? 20 : 20 }}>
            {colorList.map((color) => (
              <div
                key={color}
                onClick={() => {
                  setSelected(color);
                  if (onColorChange) onColorChange(color);
                }}
                style={{
                  width: isMobile ? 36 : 36, 
                  height: isMobile ? 36 : 36, 
                  borderRadius: "50%",
                  border: color === selected ? "2px solid #A259D9" : "1px solid #E2E1DC",
                  background: color, 
                  boxSizing: "border-box",
                  flex: `0 0 ${isMobile ? 36 : 36}px`, 
                  cursor: "pointer",
                  transition: "transform 0.2s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              />
            ))}
          </div>
        </div>
      </div>
      {/* 밝기-페인트 사이 얇은 구분선 */}
      <hr style={dividerStyle} />
      {/* 밝기 슬라이더 */}
      <div style={{ 
        marginLeft: isMobile ? 24 : 24, 
        marginTop: 24, 
        marginBottom: 20, 
        display: "flex", 
        alignItems: "center", 
        gap: isMobile ? 16 : 16 
      }}>
        <LightIcon style={{ width: isMobile ? 16 : 16, height: isMobile ? 16 : 16 }} />
        <div style={{ 
          position: "relative", 
          flex: 1, 
          marginLeft: isMobile ? 16 : 16, 
          marginRight: isMobile ? 24 : 24, 
          height: 32 
        }}>
          <input
            type="range"
            min={0.5}
            max={1.2}
            step={0.01}
            value={brightness}
            onChange={e => onBrightnessChange(Number(e.target.value))}
            style={{
              position: "absolute",
              left: 0, top: 0, width: "100%", height: 32,
              opacity: 0, zIndex: 2, cursor: "pointer",
              margin: 0, padding: 0,
            }}
          />
          {/* 보라색 트랙 */}
          <div style={{
            height: isMobile ? 8 : 8,
            background: "#E2E1DC",
            borderRadius: isMobile ? 4 : 4,
            position: "absolute",
            left: 0, right: 0, top: isMobile ? 12 : 12, zIndex: 1
          }}>
            <div style={{
              width: `${((brightness-0.5)/0.7)*100}%`,
              height: isMobile ? 8 : 8,
              background: "#A259D9",
              borderRadius: isMobile ? 4 : 4,
              position: "absolute", left: 0, top: 0
            }} />
            {/* 썸(thumb) */}
            <div style={{
              position: "absolute",
              left: `calc(${((brightness-0.5)/0.7)*100}% - ${isMobile ? 8 : 8}px)` ,
              top: isMobile ? -4 : -4,
              width: isMobile ? 16 : 16, 
              height: isMobile ? 16 : 16,
              background: "#A259D9",
              borderRadius: "50%",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              zIndex: 3,
              transition: "transform 0.2s",
            }} />
          </div>
        </div>
      </div>
      {/* 밝기 아래 두꺼운 구분선 */}
      <hr style={thickDividerStyle} />
      {/* 글꼴 */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 16, 
        padding: "0 24px", 
        minHeight: 56, 
        position: "relative" 
      }}>
        <TextIcon style={{ width: 16, height: 16 }} />
        <span style={{ 
          flex: 1, 
          fontSize: 16, 
          color: "#868D96" 
        }}>글꼴</span>
        <div ref={fontRef} style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <button
            style={{
              color: "#868D96",
              fontSize: 14,
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
              position: "absolute", top: "100%", right: 0, left: "auto", minWidth: "100%", background: "#fff", border: "1px solid #E2E1DC", borderRadius: 8, zIndex: 10
            }}>
              {fontOptions.map(opt => (
                <div key={opt} style={{ padding: 8, cursor: "pointer", color: opt === font ? "#A259D9" : "#232325" }} onClick={() => { onFontChange(opt); setFontOpen(false); }}>{opt}</div>
              ))}
            </div>
          )}
        </div>
      </div>
      <hr style={dividerStyle} />
      {/* 글자크기 */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 16, 
        padding: "0 24px", 
        minHeight: 56, 
        position: "relative" 
      }}>
        <TextSizeIcon style={{ width: 16, height: 16 }} />
        <span style={{ fontSize: 16, color: "#868D96" }}>글자크기</span>
        <span style={{ color: "#A9ABAE", fontWeight: 400, fontSize: 14, marginLeft: 8, marginRight: "auto" }}>{fontSize}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {fontSize !== DEFAULT_FONT_SIZE && (
            <button
              onClick={() => onFontSizeChange(DEFAULT_FONT_SIZE)}
              style={{ background: "none", border: "none", padding: 0, marginRight: 4, cursor: "pointer", display: "flex", alignItems: "center" }}
              title="기본값으로 되돌리기"
            >
              <RefreshIcon style={{ width: 20, height: 20, color: "#858585" }} />
            </button>
          )}
          <div style={{
            width: 104, 
            height: 28, 
            border: "1px solid #A259D9", 
            borderRadius: 9999,
            display: "flex", 
            alignItems: "center", 
            position: "relative", 
            overflow: "hidden"
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
      </div>
      {/* 글자크기-줄간격 사이 굵은 구분선 */}
      <hr style={thickDividerStyle} />
      {/* 줄간격 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 24px 0 24px", minHeight: 48, position: "relative" }}>
        <LineHeightIcon />
        <span style={{ fontSize: 16, color: "#868D96" }}>줄간격</span>
        <span style={{ color: "#A9ABAE", fontWeight: 400, fontSize: 14, marginLeft: 8, marginRight: "auto" }}>{lineHeight}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {lineHeight !== DEFAULT_LINE_HEIGHT && (
            <button
              onClick={() => onLineHeightChange(DEFAULT_LINE_HEIGHT)}
              style={{ background: "none", border: "none", padding: 0, marginRight: 4, cursor: "pointer", display: "flex", alignItems: "center" }}
              title="기본값으로 되돌리기"
            >
              <RefreshIcon style={{ width: 20, height: 20, color: "#858585" }} />
            </button>
          )}
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
      </div>
      <hr style={dividerStyle} />
      {/* 문단간격 */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "0 24px 0 24px", minHeight: 48, position: "relative" }}>
        <ParagraphSpacingIcon />
        <span style={{ fontSize: 16, color: "#868D96" }}>문단 간격</span>
        <span style={{ color: "#A9ABAE", fontWeight: 400, fontSize: 14, marginLeft: 8, marginRight: "auto" }}>{paragraphSpacing}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {paragraphSpacing !== DEFAULT_PARAGRAPH_SPACING && (
            <button
              onClick={() => onParagraphSpacingChange(DEFAULT_PARAGRAPH_SPACING)}
              style={{ background: "none", border: "none", padding: 0, marginRight: 4, cursor: "pointer", display: "flex", alignItems: "center" }}
              title="기본값으로 되돌리기"
            >
              <RefreshIcon style={{ width: 20, height: 20, color: "#858585" }} />
            </button>
          )}
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
      </div>
      <hr style={dividerStyle} />
      {/* 문단너비 */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: 16, 
        padding: "0 24px", 
        minHeight: 56, 
        position: "relative" 
      }}>
        <ParagraphWidthIcon style={{ width: 16, height: 16 }} />
        <span style={{ fontSize: 16, color: "#868D96" }}>문단 너비</span>
        <span style={{ color: "#A9ABAE", fontWeight: 400, fontSize: 14, marginLeft: 8 }}>{Math.round((paragraphWidth / 800) * 100)}%</span>
        <div style={{ 
          position: "relative", 
          flex: 1, 
          marginLeft: 16, 
          marginRight: 0, 
          height: 32 
        }}>
          <input
            type="range"
            min={300}
            max={800}
            step={10}
            value={paragraphWidth}
            onChange={e => onParagraphWidthChange(Number(e.target.value))}
            style={{
              position: "absolute",
              left: 0, top: 0, width: "100%", height: 32,
              opacity: 0, zIndex: 2, cursor: "pointer",
              margin: 0, padding: 0,
            }}
          />
          {/* 보라색 트랙 */}
          <div style={{
            height: 8,
            background: "#E2E1DC",
            borderRadius: 4,
            position: "absolute",
            left: 0, right: 0, top: 12, zIndex: 1
          }}>
            <div style={{
              width: `${((paragraphWidth - 300) / 500) * 100}%`,
              height: 8,
              background: "#A259D9",
              borderRadius: 4,
              position: "absolute", left: 0, top: 0
            }} />
            {/* 썸(thumb) */}
            <div style={{
              position: "absolute",
              left: `calc(${((paragraphWidth - 300) / 500) * 100}% - 8px)`,
              top: -4,
              width: 16, 
              height: 16,
              background: "#A259D9",
              borderRadius: "50%",
              border: "none",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              zIndex: 3,
              transition: "transform 0.2s",
            }} />
          </div>
        </div>
      </div>
    </div>
  );
} 