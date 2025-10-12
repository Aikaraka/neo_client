import Footer from "@/components/layout/Footer";

export default function GenreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full bg-background relative" style={{ height: '111.11vh' }}>
      <div className="flex-1 flex flex-col overflow-y-auto scrollbar-hidden">
        {/* Header */}
        

        {/* Main Content */}
        <main className="flex-1 w-full flex justify-center">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
} 