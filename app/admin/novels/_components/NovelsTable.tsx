"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NovelForAdmin } from "@/types/novel";
import Image from "next/image";
import { getNovelDetailsForAdmin } from "@/app/admin/_api/admin.server";
import { NovelDetailsModal } from "./NovelDetailsModal";
import { useNovelDeleteModal } from "@/app/library/_components/novelDeleteModal";
import { toast } from "@/hooks/use-toast";

interface NovelsTableProps {
  initialNovels: NovelForAdmin[];
  totalCount: number;
}

interface NovelDetails extends NovelForAdmin {
  background?: any;
  plot?: any;
  characters?: any[];
}

export function NovelsTable({ initialNovels, totalCount }: NovelsTableProps) {
  const [novels, setNovels] = useState(initialNovels);
  const [selectedNovel, setSelectedNovel] = useState<NovelDetails | null>(
    null
  );
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const { setDeleteTargetNovelId } = useNovelDeleteModal();

  const handleViewDetails = async (novel: NovelForAdmin) => {
    setIsLoadingDetails(true);
    setIsDetailsModalOpen(true);
    setSelectedNovel(novel); 
    try {
      const details = await getNovelDetailsForAdmin(novel.id);
      const processedDetails = {
        ...details,
        characters: Array.isArray(details.characters) ? details.characters : [],
      };
      setSelectedNovel({ ...novel, ...processedDetails });
    } catch (error) {
      console.error(error);
      toast({ title: "오류", description: "상세 정보를 불러오는 데 실패했습니다.", variant: "destructive" });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedNovel(null);
  };
  
  const openDeleteModal = (novelId: string) => {
    closeDetailsModal(); 
    setDeleteTargetNovelId(novelId);
  };

  return (
    <div>
      <div className="mb-4">
        <p className="text-lg">총 {totalCount}개의 소설이 있습니다.</p>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>표지</TableHead>
              <TableHead className="w-[250px]">제목</TableHead>
              <TableHead>작성자</TableHead>
              <TableHead>총 채팅 수</TableHead>
              <TableHead>생성일</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">상세보기</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {novels.map((novel) => (
              <TableRow key={novel.id}>
                <TableCell>
                  <div className="relative h-16 w-12">
                    <Image
                      src={novel.image_url || "/example/temp1.png"}
                      alt={novel.title}
                      fill
                      className="rounded-sm object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="font-medium">{novel.title}</TableCell>
                <TableCell>{novel.author_nickname}</TableCell>
                <TableCell>{novel.total_chats}</TableCell>
                <TableCell>
                  {new Date(novel.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  {novel.settings?.isPublic ? (
                    <Badge variant="default">공개</Badge>
                  ) : (
                    <Badge variant="secondary">비공개</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(novel)}
                  >
                    보기
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <NovelDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        novel={selectedNovel}
        isLoading={isLoadingDetails}
        onDelete={openDeleteModal}
      />

      {/* TODO: 페이지네이션 컴포넌트 렌더링 */}
    </div>
  );
} 