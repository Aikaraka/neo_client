import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export function UndoButton() {
  const handleUndo = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/undo-last-action`,
        {
          method: "POST",
        }
      );
      const data = await response.json();

      if (data.success) {
        alert("이전 행동이 취소되었습니다.");
      } else {
        alert("더 이상 취소할 수 없습니다.");
      }
    } catch {
      alert("작업 취소 중 오류가 발생했습니다.");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleUndo}
      className="hover:bg-accent"
    >
      <ArrowLeft className="w-6 h-6" />
    </Button>
  );
}
