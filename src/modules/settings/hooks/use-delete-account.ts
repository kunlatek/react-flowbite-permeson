import { useAccountDeletion } from "@/hooks/use-account-deletion";
import { useToast } from "@/hooks/use-toast";

export const useDeleteAccount = (onSuccess: () => void) => {
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

    return {
        handleDelete,
        loading,
        error,
    };
};