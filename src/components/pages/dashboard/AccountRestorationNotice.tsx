import { Card } from "flowbite-react";
import { useAccountDeletion } from "@/hooks/useAccountDeletion";
import { useToast } from "@/hooks/useToast";
import KuButton from "@/components/form/KuButton";

export default function AccountRestorationNotice() {
  const { daysRemaining, restoreAccount, loading } = useAccountDeletion();
  const toast = useToast();

  const handleRestore = async () => {
    try {
      await restoreAccount();
      toast.success("Sua conta foi restaurada com sucesso!");
    } catch (err: unknown) {
      console.error("Error restoring account:", err);
      toast.error("Ocorreu um erro ao restaurar sua conta.");
    }
  };

  return (
    <Card className="bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800">
      <h3 className="text-lg font-medium text-yellow-700 dark:text-yellow-400">
        Sua conta está marcada para exclusão
      </h3>
      <p className="text-yellow-600 dark:text-yellow-300">
        Sua conta e todos os seus dados serão excluídos permanentemente em{" "}
        <strong>{daysRemaining} dias</strong>.
      </p>
      <div className="mt-4 flex justify-start">
        <KuButton
          id="restore-account"
          type="button"
          actionType="apiRequest"
          variant="warning"
          onClick={handleRestore}
          loading={loading}
          label="Restaurar minha conta"
        />
      </div>
    </Card>
  );
}
