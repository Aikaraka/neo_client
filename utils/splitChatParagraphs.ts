// 따옴표("…")로 감싸진 부분을 별도 문단으로 분리하고, 그 외는 2~3문장씩 분리
export function splitChatParagraphs(text: string): string[] {
  if (!text) return [];

  // 1. 따옴표로 감싸진 부분을 우선 분리
  // "..." 또는 ‘...’ 등 다양한 따옴표 지원
  const quoteRegex = /(["'""''][^"'""'']+["'""''"])/g;
  const parts: string[] = [];
  let lastIndex = 0;

  text.replace(quoteRegex, (match, quoted, offset) => {
    // 따옴표 앞의 일반 텍스트
    if (offset > lastIndex) {
      const normal = text.slice(lastIndex, offset);
      parts.push(...splitBySentences(normal));
    }
    // 따옴표로 감싼 부분
    parts.push(quoted.trim());
    lastIndex = offset + quoted.length;
    return quoted;
  });

  // 마지막 남은 일반 텍스트
  if (lastIndex < text.length) {
    const normal = text.slice(lastIndex);
    parts.push(...splitBySentences(normal));
  }

  // 빈 문단 제거 및 트림
  return parts.map(p => p.trim()).filter(Boolean);
}

// 2~3문장씩 끊어서 배열로 반환하는 보조 함수
function splitBySentences(text: string): string[] {
  // 문장 끝: 마침표, 물음표, 느낌표, 줄바꿈 등
  const sentenceRegex = /[^.!?\n]+[.!?\n]?/g;
  const sentences = (text.match(sentenceRegex) || []).map(s => s.trim()).filter(Boolean);
  const result: string[] = [];
  for (let i = 0; i < sentences.length; i += 3) {
    // 2~3문장씩 묶어서 하나의 문단으로
    result.push(sentences.slice(i, i + 3).join(' '));
  }
  return result;
}
