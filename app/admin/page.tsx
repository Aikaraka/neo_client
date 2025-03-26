import AdminChatStats from "@/app/admin/_components/AdminCharStats";
import AdminCalculateTopNovels from "@/app/admin/_components/AdminCalculateTopNovels";
import AdminViewRankings from "@/app/admin/_components/AdminViewRankings";

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">관리자 페이지</h1>

      <div className="bg-white shadow-md rounded p-6 mb-6">
        <AdminChatStats />
      </div>

      <div className="bg-white shadow-md rounded p-6 mb-6">
        <AdminCalculateTopNovels />
      </div>

      <div className="bg-white shadow-md rounded p-6 mb-6">
        <AdminViewRankings />
      </div>

      {/* 다른 관리 기능들 추가 */}
    </div>
  );
}
