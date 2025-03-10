// app/admin/page.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import AdminChatStats from "@/app/_components/AdminChatStats";
import AdminCalculateTopNovels from "@/app/_components/AdminCalculateTopNovels";
import AdminViewRankings from "@/app/_components/AdminViewRankings";

// 어드민 권한 확인 함수
async function checkAdminAccess() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    return false;
  }
  
  // 환경 변수에서 어드민 이메일 목록 가져오기
  const adminEmailsStr = process.env.ADMIN_EMAIL || '';
  console.log('Admin Emails Env:', adminEmailsStr);
  
  // 문자열 처리 및 배열 변환
  let adminEmails: string[] = [];
  try {
    // 대괄호가 있는 경우 제거하고 쉼표로 분리
    adminEmails = adminEmailsStr
      .replace(/^\[|\]$/g, '') // 시작과 끝의 대괄호 제거
      .split(',')
      .map(email => email.trim());
      
    console.log('Parsed Admin Emails:', adminEmails);
  } catch (e) {
    console.error('Error parsing admin emails:', e);
    adminEmails = [];
  }
  
  // 현재 로그인한 사용자의 이메일이 어드민 목록에 있는지 확인
  const userEmail = user.email || '';
  console.log('Current User Email:', userEmail);
  console.log('Is Admin:', adminEmails.includes(userEmail));
  
  return adminEmails.includes(userEmail);
}

export default async function AdminPage() {
  // 어드민 권한 확인
  const isAdmin = await checkAdminAccess();
  
  if (!isAdmin) {
    // 권한이 없으면 홈페이지로 리다이렉트
    redirect('/');
  }
  
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