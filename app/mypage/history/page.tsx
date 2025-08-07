import PrevPageButton from "@/components/ui/PrevPageButton";
import { getPaymentHistory, getUsageHistory } from "../_api/history.server";
import HistoryClient from "./HistoryClient";

export const dynamic = "force-dynamic";

export default async function HistoryPage({
  searchParams,
}: {
  searchParams?: Promise<{ tab?: string; page?: string; pageSize?: string }>;
}) {
  const sp = (await searchParams) ?? {};
  const defaultTab = sp.tab === "usage" ? "usage" : "charge";
  const page = Number(sp.page ?? 1) || 1;
  const pageSize = Number(sp.pageSize ?? 10) || 10;

  const payment = await getPaymentHistory(defaultTab === "charge" ? page : 1, pageSize);
  const usage = await getUsageHistory(defaultTab === "usage" ? page : 1, pageSize);

  return (
    <div className="container mx-auto max-w-2xl py-8 px-4">
      <div className="relative flex items-center justify-center mb-6">
        <div className="absolute left-0">
          <PrevPageButton />
        </div>
        <h1 className="text-2xl font-bold text-center">토큰 이용내역</h1>
      </div>
      <HistoryClient
        initialPayments={payment.items}
        initialUsages={usage.items}
        defaultTab={defaultTab}
        page={page}
        pageSize={pageSize}
        totalCharge={payment.total}
        totalUsage={usage.total}
      />
    </div>
  );
} 