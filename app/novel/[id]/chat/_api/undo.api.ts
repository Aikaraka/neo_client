export async function undoLastStory(novelId: string, userId?: string) {
  if (!userId) {
    throw new Error("유저 정보가 없습니다.");
  }

  if (!novelId) {
    throw new Error("소설 ID가 없습니다.");
  }

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL ||
    (typeof window !== "undefined"
      ? `${window.location.protocol}//${window.location.hostname}:8000`
      : "http://localhost:8000");

  try {
    const response = await fetch(`${API_URL}/undo-last-action`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        user_id: userId,
        novel_id: novelId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Undo 요청 실패: ${response.status} ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error("Undo 요청 중 오류:", error);
    throw error;
  }
}
