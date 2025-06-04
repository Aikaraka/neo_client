import React from 'react';
import Link from 'next/link';

const Footer = () => {
  return (
    <footer className="bg-gray-100 text-gray-600 text-sm py-6 border-t border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          <div className="mb-4 md:mb-0">
            <p className="font-semibold">더퍼레이드</p>
            <p>대표: 임대한 | 사업자등록번호: 702-11-02885 | 통신판매업신고번호</p>
            <p>주소: 서울시 서대문구 성산로 18길 49 </p>
            <p>문의: <a href="mailto:limdehan@gmail.com" className="hover:text-blue-500">limdehan@gmail.com</a></p>
          </div>
          <div className="flex space-x-6">
            <Link href="/terms/service" className="hover:text-blue-500">이용약관</Link>
            <Link href="/terms/privacy" className="hover:text-blue-500">개인정보처리방침</Link>
            <Link href="/terms/copyright" className="hover:text-blue-500">콘텐츠 심의 규정</Link>
          </div>
        </div>
        <div className="text-center text-xs text-gray-400 mt-4">
          <p>© 2025 TheParade. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 