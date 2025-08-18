"use client";

import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { NovelForAdmin } from "@/types/novel";
import Image from "next/image";
import { getNovelDetailsForAdmin, deleteNovelAsAdmin, getNovelsForAdmin } from "@/app/admin/_api/admin.server";
import { NovelDetailsModal } from "./NovelDetailsModal";
import { toast } from "@/hooks/use-toast";
import { Json } from "@/utils/supabase/types/database.types";
import { Modal, LoadingModal } from "@/components/ui/modal";
import { Search, Loader2 } from "lucide-react";

interface Character {
  name: string;
  description: string;
}

interface NovelDetails extends NovelForAdmin {
  background?: Json;
  plot?: Json;
  characters?: Character[];
}

interface NovelsTableProps {
  initialNovels: NovelForAdmin[];
  totalCount: number;
}

export function NovelsTable({ initialNovels, totalCount }: NovelsTableProps) {
  const [novels, setNovels] = useState<NovelForAdmin[]>(initialNovels);
  const [totalNovels, setTotalNovels] = useState(totalCount);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const [selectedNovel, setSelectedNovel] = useState<NovelDetails | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);
  
  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(totalNovels / ITEMS_PER_PAGE);

  // 세계관 목록 가져오기
  const fetchNovels = async (page: number, search: string = "") => {
    setIsLoading(true);
    try {
      const { novels: fetchedNovels, count } = await getNovelsForAdmin({
        page,
        limit: ITEMS_PER_PAGE,
        searchTerm: search || undefined,
      });
      setNovels(fetchedNovels);
      setTotalNovels(count);
    } catch (error) {
      console.error("Failed to fetch novels:", error);
      toast({
        title: "오류",
        description: "세계관 목록을 불러오는 데 실패했습니다.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // 페이지 변경 시
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchNovels(page, searchTerm);
  };

  // 검색어 입력 디바운싱
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm !== "") {
        setCurrentPage(1);
        fetchNovels(1, searchTerm);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]); // handleSearch 함수 대신 직접 호출

  const handleViewDetails = async (novel: NovelForAdmin) => {
    setIsLoadingDetails(true);
    setIsDetailsModalOpen(true);
    setSelectedNovel(novel);
    try {
      const details = await getNovelDetailsForAdmin(novel.id);
      
      // 'characters'가 배열인 경우, 각 요소를 안전하게 변환
      const safeCharacters: Character[] = Array.isArray(details.characters)
        ? details.characters.map((char: Json) => {
            // char가 name과 description을 가진 객체 형태인지 명시적으로 확인
            if (
              typeof char === "object" &&
              char !== null &&
              "name" in char &&
              "description" in char
            ) {
              return {
                name: String(char.name),
                description: String(char.description),
              };
            }
            // 그 외의 경우, 안전한 기본값 반환
            return { name: "이름 없음", description: "설명 없음" };
          })
        : [];

      const processedDetails = {
        ...details,
        characters: safeCharacters,
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
    setDeleteTargetId(novelId);
  };

  const handleDeleteNovel = async () => {
    if (!deleteTargetId) return;
    
    setIsDeleting(true);
    try {
      await deleteNovelAsAdmin(deleteTargetId);
      toast({ 
        title: "삭제 완료", 
        description: "세계관이 성공적으로 삭제되었습니다." 
      });
      setDeleteTargetId("");
      
      // 현재 페이지에서 목록 새로고침
      fetchNovels(currentPage, searchTerm);
    } catch (error) {
      console.error("Failed to delete novel:", error);
      toast({ 
        title: "삭제 실패", 
        description: error instanceof Error ? error.message : "세계관 삭제 중 오류가 발생했습니다.", 
        variant: "destructive" 
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // 페이지네이션 번호 생성
  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // 전체 페이지가 5개 이하면 모두 표시
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // 복잡한 페이지네이션 로직
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, currentPage + 2);

      if (currentPage <= 3) {
        endPage = 5;
      } else if (currentPage >= totalPages - 2) {
        startPage = totalPages - 4;
      }

      // 시작 페이지들
      if (startPage > 1) {
        items.push(
          <PaginationItem key={1}>
            <PaginationLink onClick={() => handlePageChange(1)} className="cursor-pointer">
              1
            </PaginationLink>
          </PaginationItem>
        );
        if (startPage > 2) {
          items.push(
            <PaginationItem key="ellipsis1">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
      }

      // 현재 페이지 주변
      for (let i = startPage; i <= endPage; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // 끝 페이지들
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          items.push(
            <PaginationItem key="ellipsis2">
              <PaginationEllipsis />
            </PaginationItem>
          );
        }
        items.push(
          <PaginationItem key={totalPages}>
            <PaginationLink onClick={() => handlePageChange(totalPages)} className="cursor-pointer">
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        );
      }
    }

    return items;
  };

  return (
    <div>
      {/* 검색 및 통계 */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <p className="text-lg font-semibold">
            총 {totalNovels.toLocaleString()}개의 세계관
          </p>
          <div className="text-sm text-gray-500">
            (페이지 {currentPage} / {totalPages})
          </div>
        </div>
        
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="세계관 제목 또는 작성자로 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* 테이블 */}
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
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>로딩 중...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : novels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  {searchTerm ? "검색 결과가 없습니다." : "세계관이 없습니다."}
                </TableCell>
              </TableRow>
            ) : (
              novels.map((novel) => (
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
                  <TableCell>{novel.total_chats.toLocaleString()}</TableCell>
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
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                  className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {renderPaginationItems()}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                  className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <NovelDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={closeDetailsModal}
        novel={selectedNovel}
        isLoading={isLoadingDetails}
        onDelete={openDeleteModal}
      />

      {/* 어드민 전용 삭제 확인 모달 */}
      <Modal
        open={!!deleteTargetId}
        switch={() => setDeleteTargetId("")}
        onConfirm={handleDeleteNovel}
      >
        해당 세계관을 삭제하시겠습니까?
      </Modal>
      
      {/* 삭제 중 로딩 모달 */}
      <LoadingModal visible={isDeleting} />
    </div>
  );
} 