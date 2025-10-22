import { Alert } from "flowbite-react";
import { useAccountDeletion } from "@/hooks/useAccountDeletion";
import { useToast } from "@/hooks/useToast";
import { KuButton } from "@/components/form";

interface DeleteAccountConfirmProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DeleteAccountConfirm({
  onSuccess,
  onCancel,
}: DeleteAccountConfirmProps) {
  const { softDeleteAccount, loading, error } = useAccountDeletion();
  const toast = useToast();

  const handleDelete = async () => {
    try {
      await softDeleteAccount();
      toast.success("Sua conta foi marcada para exclusão.");
      onSuccess();
    } catch (err: unknown) {
      console.error("Error deleting account:", err);
      toast.error("Ocorreu um erro ao tentar excluir sua conta.");
    }
  };

  return (
    <div className="text-center">
      {error && (
        <Alert color="failure" className="mb-4 text-left">
          {error}
        </Alert>
      )}
      <h3 className="mb-5 text-lg font-normal text-gray-800 dark:text-gray-400">
        Tem certeza que deseja excluir sua conta?
      </h3>
      <p className="mb-5 text-sm text-gray-600 dark:text-gray-500">
        Sua conta será marcada para exclusão e removida permanentemente após 90
        dias.
      </p>
      <div className="flex justify-center gap-4">
        <KuButton
          id="cancel-delete"
          type="button"
          actionType="apiRequest"
          variant="secondary"
          onClick={onCancel}
          isDisabled={loading}
          label="Cancelar"
        />
        <KuButton
          id="confirm-delete"
          type="button"
          actionType="apiRequest"
          variant="danger"
          onClick={handleDelete}
          loading={loading}
          label="Sim, excluir"
        />
      </div>
    </div>
  );
}
