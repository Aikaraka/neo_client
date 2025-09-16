"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateNickname } from "../_api/updateNickname.server";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentNickname: string;
  onNicknameUpdate?: () => void;
  onImageEditClick?: () => void;
}

export default function ProfileEditModal({
  isOpen,
  onClose,
  currentNickname,
  onNicknameUpdate,
  onImageEditClick,
}: ProfileEditModalProps) {
  const [nickname, setNickname] = useState(currentNickname);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nickname === currentNickname) {
      toast({
        title: "변경사항 없음",
        description: "닉네임이 기존과 동일합니다.",
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await updateNickname(nickname);
      
      if (result.error) {
        toast({
          title: "변경 실패",
          description: result.error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "변경 완료",
          description: "닉네임이 성공적으로 변경되었습니다.",
        });
        onNicknameUpdate?.();
        onClose();
      }
    } catch {
      toast({
        title: "오류 발생",
        description: "닉네임 변경 중 오류가 발생했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>프로필 편집</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nickname">닉네임</Label>
            <Input
              id="nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="새로운 닉네임을 입력하세요"
              maxLength={20}
              disabled={isLoading}
            />
            <p className="text-sm text-muted-foreground">
              2자 이상 20자 이하로 입력해주세요.
            </p>
          </div>
          
          {/* 프로필 이미지 변경 버튼 */}
          <div className="space-y-2">
            <Label>프로필 이미지</Label>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                onImageEditClick?.();
                onClose();
              }}
              disabled={isLoading}
            >
              프로필 이미지 변경
            </Button>
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              취소
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  변경 중...
                </>
              ) : (
                "변경하기"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
