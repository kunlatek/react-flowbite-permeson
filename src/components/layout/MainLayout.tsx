import { Outlet } from "react-router-dom";
import KuNavbar from "@/components/common/KuNavbar";

export default function MainLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
      <KuNavbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
