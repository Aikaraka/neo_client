import { getNovelsForAdmin } from '../_api/admin.server';
import { NovelsTable } from './_components/NovelsTable';

export default async function AdminNovelsPage() {
  const { novels, count } = await getNovelsForAdmin({ page: 1, limit: 10 });

  return (
    <div className="container mx-auto py-10">
      <h1 className="mb-8 text-3xl font-bold">콘텐츠 관리</h1>
      <NovelsTable initialNovels={novels} totalCount={count} />
    </div>
  );
} 