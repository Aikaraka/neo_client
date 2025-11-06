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
  onApprove?: (novelId: string) => void;
  onReject?: (novelId: string) => void;
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
  onApprove,
  onReject,
}: NovelDetailsModalProps) {
  const approvalStatus = novel?.approval_status;
  const isPending = approvalStatus === "pending" || !approvalStatus;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{novel?.title || "로딩 중..."}</DialogTitle>
          <DialogDescription>세계관 상세 정보</DialogDescription>
        </DialogHeader>
        
        {/* 스크롤 가능한 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="py-8 text-center">로딩 중...</div>
          ) : novel ? (
            <div className="grid gap-6 py-4 pr-2">
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="text-right font-semibold pt-1">배경</span>
                <div className="col-span-3">
                  <pre className="whitespace-pre-wrap font-sans text-sm bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
                    {renderContent(novel.background)}
                  </pre>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="text-right font-semibold pt-1">줄거리</span>
                <div className="col-span-3">
                  <pre className="whitespace-pre-wrap font-sans text-sm bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
                    {renderContent(novel.plot)}
                  </pre>
                </div>
              </div>
              
              <div className="grid grid-cols-4 items-start gap-4">
                <span className="text-right font-semibold pt-1">캐릭터</span>
                <div className="col-span-3 space-y-3">
                  {novel.characters?.map((char, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <p className="font-bold text-sm mb-2">{renderContent(char.name)}</p>
                      <pre className="whitespace-pre-wrap font-sans text-sm max-h-32 overflow-y-auto">
                        {renderContent(char.description)}
                      </pre>
                    </div>
                  ))}
                  {(!novel.characters || novel.characters.length === 0) && (
                    <p className="text-gray-500 text-sm">등록된 캐릭터가 없습니다.</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center">상세 정보를 불러올 수 없습니다.</div>
          )}
        </div>
        
        {/* 고정된 푸터 */}
        <DialogFooter className="flex-shrink-0 sm:justify-between border-t pt-4">
          <div className="flex gap-2">
            {isPending && onApprove && (
              <Button
                variant="default"
                onClick={() => novel && onApprove(novel.id)}
                disabled={!novel || isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                승인
              </Button>
            )}
            {isPending && onReject && (
              <Button
                variant="destructive"
                onClick={() => novel && onReject(novel.id)}
                disabled={!novel || isLoading}
              >
                거부
              </Button>
            )}
            <Button
              variant="destructive"
              onClick={() => novel && onDelete(novel.id)}
              disabled={!novel || isLoading}
            >
              삭제
            </Button>
          </div>
          <Button onClick={onClose} disabled={isLoading}>
            닫기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 