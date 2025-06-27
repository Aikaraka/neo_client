"use client";

import AdminChatStats from "@/app/admin/_components/AdminCharStats";
import AdminCalculateTopNovels from "@/app/admin/_components/AdminCalculateTopNovels";
import AdminViewRankings from "@/app/admin/_components/AdminViewRankings";
import { useState } from "react";

export default function AdminStatsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRankingsUpdate = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">통계 및 시스템</h1>
      <div className="space-y-8">
        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">채팅 통계</h2>
          <AdminChatStats />
        </div>

        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">랭킹 집계</h2>
          <AdminCalculateTopNovels onCalculationComplete={handleRankingsUpdate} />
        </div>

        <div className="bg-white shadow-md rounded p-6">
          <h2 className="text-xl font-semibold mb-4">랭킹 조회</h2>
          <AdminViewRankings refreshKey={refreshKey} />
        </div>
      </div>
    </div>
  );
} 