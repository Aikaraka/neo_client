"use client";

import { usePathname } from 'next/navigation';
import MainHeader from './MainHeader';

const AUTH_ROUTES = ['/login', '/signup', '/find'];

export default function ConditionalHeader() {
  const pathname = usePathname();

  const isAuthPage = AUTH_ROUTES.some(route => pathname.startsWith(route));

  if (isAuthPage) {
    return null;
  }

  return <MainHeader />;
}
