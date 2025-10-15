import Link from "next/link";
import { PropsWithChildren } from "react";
import { BookMarked, Home, LineChart, Users, MessageSquareHeart } from "lucide-react";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/novels", label: "콘텐츠 관리", icon: BookMarked },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/stats", label: "통계/시스템", icon: LineChart },
  { href: "/admin/support", label: "고객 지원 관리", icon: MessageSquareHeart },
];

export default async function AdminLayout({ children }: PropsWithChildren) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?message=관리자 로그인이 필요합니다.");
  }

  const { data: userRole, error } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (error || userRole?.role !== "admin") {
    redirect("/?message=관리자 권한이 없습니다.");
  }

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4">
        <h1 className="text-2xl font-bold mb-8">NEO Admin</h1>
        <nav>
          <ul>
            {navLinks.map((link) => (
              <li key={link.href} className="mb-4">
                <Link
                  href={link.href}
                  className="flex items-center p-2 rounded hover:bg-gray-700"
                >
                  <link.icon className="mr-3" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="flex-1 p-8 bg-gray-100">{children}</main>
    </div>
  );
} 