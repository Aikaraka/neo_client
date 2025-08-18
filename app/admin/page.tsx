export default function AdminDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">대시보드</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">총 사용자 수</h2>
          <p className="text-3xl font-bold">1,234</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">총 세계관 수</h2>
          <p className="text-3xl font-bold">567</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">오늘 가입자</h2>
          <p className="text-3xl font-bold">8</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-2">새로운 세계관</h2>
          <p className="text-3xl font-bold">3</p>
        </div>
      </div>
    </div>
  );
}
