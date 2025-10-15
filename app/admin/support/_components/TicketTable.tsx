"use client";

import { useState } from "react";
import { updateTicketStatus } from "../../_api/admin.server";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Select from "@/components/ui/select"; // 프로젝트의 기존 Select 컴포넌트 사용
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// re-export된 타입 대신 직접 가져오도록 수정
type Ticket = Awaited<
  ReturnType<typeof import("../../_api/admin.server").getSupportTickets>
>[number];

export function TicketTable({ initialTickets }: { initialTickets: Ticket[] }) {
  const [tickets, setTickets] = useState(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const { toast } = useToast();

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    const result = await updateTicketStatus(ticketId, newStatus);
    if (result.success) {
      setTickets(
        tickets.map((t) =>
          t.id === ticketId ? { ...t, status: newStatus } : t
        )
      );
      toast({
        title: "성공",
        description: "티켓 상태가 변경되었습니다.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "오류",
        description: result.message,
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "open":
        return "destructive";
      case "in_progress":
        return "secondary";
      case "closed":
        return "default";
      default:
        return "outline";
    }
  };

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>생성일</TableHead>
            <TableHead>카테고리</TableHead>
            <TableHead>제목</TableHead>
            <TableHead>작성자 이메일</TableHead>
            <TableHead>답변 받을 이메일</TableHead>
            <TableHead>상태</TableHead>
            <TableHead>액션</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((ticket) => (
            <TableRow key={ticket.id}>
              <TableCell>
                {new Date(ticket.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>{ticket.category}</TableCell>
              <TableCell>{ticket.title}</TableCell>
              <TableCell>{ticket.user_email}</TableCell>
              <TableCell>{ticket.email}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(ticket.status)}>
                  {ticket.status}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTicket(ticket)}
                >
                  내용 보기
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedTicket && (
        <div className="p-4 border rounded-md bg-gray-50">
          <h3 className="font-bold text-lg mb-2">
            문의 내용: {selectedTicket.title}
          </h3>
          <p className="whitespace-pre-wrap mb-4">{selectedTicket.content}</p>
          <div className="flex items-center gap-4">
            <h4 className="font-semibold">상태 변경:</h4>
            <Select
              className="w-[180px]"
              options={["open", "in_progress", "closed"]}
              placeholder="상태 선택"
              value={selectedTicket.status}
              onChange={(e) =>
                handleStatusChange(selectedTicket.id, e.target.value)
              }
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedTicket(null)}
            >
              닫기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
