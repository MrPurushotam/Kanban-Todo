import Sidebar from "@/components/dashboard/sidebar";
import ProtectedRoutes from "@/lib/ProtectedRoutes";
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <ProtectedRoutes>
      <div className="flex h-screen overflow-hidden bg-background">
        <Sidebar />
        <main className={`flex-1 overflow-auto transition-all duration-300 ease-in-out`}>
          <div className="container mx-auto p-2">
            {children}
          </div>
        </main>
      </div>
    </ProtectedRoutes>
  );
}
