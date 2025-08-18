//관리자용 세계관 상세 모달
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NovelForAdmin } from "@/types/novel";
import { Json } from "@/utils/supabase/types/database.types";

// 더 구체적인 타입을 정의합니다.
interface Character {
  name: string;
  description: string;
}
interface NovelDetails extends NovelForAdmin {
  background?: Json;
  plot?: Json;
  characters?: Character[];
}

interface NovelDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  novel: NovelDetails | null;
  isLoading: boolean;
  onDelete: (novelId: string) => void;
}

// Helper function to safely render content
const renderContent = (content: string | Json | undefined | null) => {
  if (content === null || content === undefined) {
    return "";
  }
  if (typeof content === 'string') {
    return content;
  }
  if (typeof content === "object" && content !== null) {
    return JSON.stringify(content, null, 2);
  }
  return "";
};

export function NovelDetailsModal({
  isOpen,
  onClose,
  novel,
  isLoading,
  onDelete,
}: NovelDetailsModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{novel?.title || "로딩 중..."}</DialogTitle>
          <DialogDescription>세계관 상세 정보</DialogDescription>
        </DialogHeader>
        {isLoading ? (
          <div className="py-8 text-center">로딩 중...</div>
        ) : novel ? (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-semibold">배경</span>
              <pre className="col-span-3 whitespace-pre-wrap font-sans">
                {renderContent(novel.background)}
              </pre>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <span className="text-right font-semibold">줄거리</span>
              <pre className="col-span-3 whitespace-pre-wrap font-sans">
                {renderContent(novel.plot)}
              </pre>
            </div>
            <div className="grid grid-cols-4 items-start gap-4">
              <span className="text-right font-semibold">캐릭터</span>
              <div className="col-span-3">
                {novel.characters?.map((char, index) => (
                  <div key={index} className="mb-2">
                    <p className="font-bold">{renderContent(char.name)}</p>
                    <pre className="whitespace-pre-wrap font-sans">
                      {renderContent(char.description)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">상세 정보를 불러올 수 없습니다.</div>
        )}
        <DialogFooter className="sm:justify-between">
          <Button
            variant="destructive"
            onClick={() => novel && onDelete(novel.id)}
            disabled={!novel || isLoading}
          >
            삭제
          </Button>
          <Button onClick={onClose} disabled={isLoading}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 