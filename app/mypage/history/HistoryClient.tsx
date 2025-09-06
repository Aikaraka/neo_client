"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  PaymentHistoryItem,
  UsageHistoryItem,
} from "../_api/history.server";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, MinusCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

// 날짜 포맷 함수
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

function Pagination({
  page,
  pageSize,
  total,
  tab,
}: {
  page: number;
  pageSize: number;
  total: number;
  tab: "charge" | "usage";
}) {
  const router = useRouter();
  const search = useSearchParams();
  const maxPage = Math.max(1, Math.ceil(total / pageSize));
  const canPrev = page > 1;
  const canNext = page < maxPage;

  const go = (nextPage: number) => {
    const params = new URLSearchParams(search?.toString());
    params.set("tab", tab);
    params.set("page", String(nextPage));
    params.set("pageSize", String(pageSize));
    router.push(`/mypage/history?${params.toString()}`);
  };

  if (total <= pageSize) return null;

  return (
    <div className="flex items-center justify-between mt-6">
      <Button variant="outline" disabled={!canPrev} onClick={() => go(page - 1)}>
        이전
      </Button>
      <div className="text-sm text-gray-600">
        {page} / {maxPage}
      </div>
      <Button variant="outline" disabled={!canNext} onClick={() => go(page + 1)}>
        다음
      </Button>
    </div>
  );
}

// 충전 내역 리스트
function PaymentHistoryList({ items }: { items: PaymentHistoryItem[] }) {
  if (items.length === 0) {
    return <p className="text-center text-gray-500 py-10">충전 내역이 없습니다.</p>;
  }
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="w-full">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <PlusCircle className="w-8 h-8 text-blue-500" />
              <div>
                <p className="font-semibold">
                  {item.provider === 'free' ? '매일 무료 조각' : '조각 충전'}
                </p>
                <p className="text-sm text-gray-500">{formatDate(item.created_at)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg text-blue-500">
                +{item.tokens_charged.toLocaleString()} 조각
              </p>
              {item.provider !== 'free' && (
                <p className="text-sm text-gray-500">{item.amount.toLocaleString()}원</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// 사용 내역 리스트
function UsageHistoryList({ items }: { items: UsageHistoryItem[] }) {
  if (items.length === 0) {
    return <p className="text-center text-gray-500 py-10">사용 내역이 없습니다.</p>;
  }
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} className="w-full">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <MinusCircle className="w-8 h-8 text-red-500" />
              <div>
                <p className="font-semibold">{item.usage_description}</p>
                <p className="text-sm text-gray-500">{formatDate(item.created_at)}</p>
              </div>
            </div>
            <p className="font-bold text-lg text-red-500">
              -{item.tokens_used.toLocaleString()} 조각
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function HistoryClient({
  initialPayments,
  initialUsages,
  defaultTab = "charge",
  page = 1,
  pageSize = 10,
  totalCharge = 0,
  totalUsage = 0,
}: {
  initialPayments: PaymentHistoryItem[];
  initialUsages: UsageHistoryItem[];
  defaultTab?: "charge" | "usage";
  page?: number;
  pageSize?: number;
  totalCharge?: number;
  totalUsage?: number;
}) {
  const currentPage = page;
  const currentPageSize = pageSize;

  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="charge">충전 내역</TabsTrigger>
        <TabsTrigger value="usage">사용 내역</TabsTrigger>
      </TabsList>
      <TabsContent value="charge" className="mt-6">
        <PaymentHistoryList items={initialPayments} />
        <Pagination
          page={currentPage}
          pageSize={currentPageSize}
          total={totalCharge}
          tab="charge"
        />
      </TabsContent>
      <TabsContent value="usage" className="mt-6">
        <UsageHistoryList items={initialUsages} />
        <Pagination
          page={currentPage}
          pageSize={currentPageSize}
          total={totalUsage}
          tab="usage"
        />
      </TabsContent>
    </Tabs>
  );
} 