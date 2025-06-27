import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { PropsWithChildren } from "react";
import { BookMarked, Home, LineChart, Users } from "lucide-react";

const navLinks = [
  { href: "/admin", label: "Dashboard", icon: Home },
  { href: "/admin/novels", label: "콘텐츠 관리", icon: BookMarked },
  { href: "/admin/users", label: "사용자 관리", icon: Users },
  { href: "/admin/stats", label: "통계/시스템", icon: LineChart },
];

export default async function AdminLayout({ children }: PropsWithChildren) {
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