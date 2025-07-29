// 따옴표("…")로 감싸진 부분을 별도 문단으로 분리하고, 그 외는 2~3문장씩 분리
export function splitChatParagraphs(text: string): string[] {
  if (!text) return [];

  const parts: string[] = [];
  let buffer = '';
  let inQuote = false;
  let quoteChar = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    // 큰따옴표 시작
    if (!inQuote && (char === '“' || char === '"')) {
      if (buffer.trim()) parts.push(...splitBySentences(buffer));
      buffer = char;
      inQuote = true;
      quoteChar = (char === '“') ? '”' : '"';
    }
    // 큰따옴표 끝
    else if (inQuote && char === quoteChar) {
      buffer += char;
      parts.push(buffer.trim());
      buffer = '';
      inQuote = false;
      quoteChar = '';
    }
    // 따옴표 내부
    else {
      buffer += char;
    }
  }
  // 남은 텍스트 처리
  if (buffer.trim()) {
    if (inQuote) {
      // 따옴표가 닫히지 않은 경우, 그냥 문단으로
      parts.push(buffer.trim());
    } else {
      parts.push(...splitBySentences(buffer));
    }
  }
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
