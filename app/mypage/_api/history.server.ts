"use server";

import { createClient } from "@/utils/supabase/server";
import { unstable_noStore as noStore } from "next/cache";

// 충전 내역 타입
export type PaymentHistoryItem = {
  id: string;
  tokens_charged: number;
  amount: number;
  provider: string | null;
  created_at: string;
};

// 사용 내역 타입
export type UsageHistoryItem = {
  id: string;
  tokens_used: number;
  usage_description: string;
  created_at: string;
};

export type PagedResult<T> = {
  items: T[];
  total: number;
};

// 충전 내역 조회 함수 (페이징)
export async function getPaymentHistory(
  page: number = 1,
  pageSize: number = 10
): Promise<PagedResult<PaymentHistoryItem>> {
  noStore();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { items: [], total: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("payment_history")
    .select("id, tokens_charged, amount, provider, created_at", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Payment history fetch error:", error);
    return { items: [], total: 0 };
  }
  return { items: data || [], total: count ?? 0 };
}

// 사용 내역 조회 함수 (페이징)
export async function getUsageHistory(
  page: number = 1,
  pageSize: number = 10
): Promise<PagedResult<UsageHistoryItem>> {
  noStore();
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { items: [], total: 0 };

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await supabase
    .from("token_usage_history")
    .select("id, tokens_used, usage_description, created_at", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Usage history fetch error:", error);
    return { items: [], total: 0 };
  }
  return { items: data || [], total: count ?? 0 };
} 