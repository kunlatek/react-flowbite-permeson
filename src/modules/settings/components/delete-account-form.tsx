import { Alert } from "flowbite-react";
import { KuButton } from "@/components/form";
import { useDeleteAccount } from "../hooks/use-delete-account";

interface DeleteAccountFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function DeleteAccountForm({
  onSuccess,
  onCancel,
}: DeleteAccountFormProps) {
  
  const deleteAccount = useDeleteAccount(onSuccess);

  return (
    <div className="text-center">
      {deleteAccount.error && (
        <Alert color="failure" className="mb-4 text-left">
          {deleteAccount.error}
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
          isDisabled={deleteAccount.loading}
          label="Cancelar"
        />
        <KuButton
          id="confirm-delete"
          type="button"
          actionType="apiRequest"
          variant="danger"
          onClick={deleteAccount.handleDelete}
          loading={deleteAccount.loading}
          label="Sim, excluir"
        />
      </div>
    </div>
  );
}
