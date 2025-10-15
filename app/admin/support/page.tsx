import { getSupportTickets } from "../_api/admin.server";
import { TicketTable } from "./_components/TicketTable";

export default async function AdminSupportPage() {
  const tickets = await getSupportTickets();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">고객 지원 티켓 관리</h1>
      {tickets.length > 0 ? (
        <TicketTable initialTickets={tickets} />
      ) : (
        <p className="text-center text-gray-500">아직 접수된 티켓이 없습니다.</p>
      )}
    </div>
  );
}
