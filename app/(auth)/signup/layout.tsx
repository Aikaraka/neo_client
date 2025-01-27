import { ChevronLeft } from "lucide-react";

export default function SignUpNavigator({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="h-screen px-8 py-10">
      <nav className="w-full">
        <ChevronLeft size={32} />
      </nav>
      {children}
    </div>
  );
}
