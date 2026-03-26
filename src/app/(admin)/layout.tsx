import AdminSidebar from "@/components/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans text-gray-800">
      <AdminSidebar />
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-white">
        {children}
      </main>
    </div>
  );
}
