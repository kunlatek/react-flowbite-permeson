import { useAuth } from "@/hooks/useAuth";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Dashboard
      </h1>
      <p className="text-gray-600 dark:text-gray-400">
        Olá, {user?.email}! Bem-vindo(a) de volta.
      </p>
    </div>
  );
}
