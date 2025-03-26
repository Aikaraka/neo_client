export function undoLastStory(novelId: string, userId?: string) {
  if (!userId) throw new Error("유저 정보가 없습니다.");

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
  return fetch(`${API_URL}/undo-last-action`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      user_id: userId,
      novel_id: novelId,
    }),
  });
}
