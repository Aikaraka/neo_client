import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="w-full h-screen whitespace-nowrap pb-20 relative flex justify-center overflow-x-hidden">
        {children}
      </div>
    </>
  );
}
