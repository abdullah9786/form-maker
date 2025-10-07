import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileSidebar } from '@/components/dashboard/MobileSidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex">
      <aside className="w-64 hidden md:block">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-auto">
        <div className="md:hidden border-b p-4 bg-background sticky top-0 z-10">
          <MobileSidebar />
        </div>
        {children}
      </main>
    </div>
  );
}

