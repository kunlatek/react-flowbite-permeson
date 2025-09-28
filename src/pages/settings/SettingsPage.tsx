import { useState, useEffect } from "react";
import { Card } from "flowbite-react";
import { useAccountDeletion } from "@/hooks/useAccountDeletion";
import { Spinner } from "flowbite-react";
import KuModal from "@/components/common/KuModal";
import KuButton from "@/components/form/KuButton";
import ChangePasswordForm from "@/components/pages/settings/ChangePasswordForm";
import DeleteAccountConfirm from "@/components/pages/settings/DeleteAccountConfirm";
import AccountRestorationNotice from "@/components/pages/dashboard/AccountRestorationNotice";

export default function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { isDeleted, fetchDeletionStatus, loading } = useAccountDeletion();

  useEffect(() => {
    fetchDeletionStatus();
  }, [fetchDeletionStatus]);

  if (loading && isDeleted === null) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Configurações da Conta
      </h1>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        Gerencie suas preferências e configurações de conta.
      </p>

      {isDeleted ? (
        <AccountRestorationNotice />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Segurança
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium dark:text-white">Alterar Senha</h3>
                <p className="text-gray-600 dark:text-gray-400 my-2">
                  Recomendamos alterar sua senha regularmente.
                </p>
                <KuButton
                  id="change-pass-modal-btn"
                  type="button"
                  actionType="apiRequest"
                  onClick={() => setShowPasswordModal(true)}
                  label="Alterar senha"
                />
              </div>
            </div>
          </Card>
          <Card>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-500 mb-2">
              Exclusão de Conta
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Esta ação é irreversível após 90 dias. Todos os seus dados serão
              perdidos.
            </p>
            <KuButton
              id="delete-account-modal-btn"
              type="button"
              actionType="apiRequest"
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              label="Excluir minha conta"
            />
          </Card>
        </div>
      )}

      <KuModal
        show={showPasswordModal}
        title="Alterar Senha"
        onClose={() => setShowPasswordModal(false)}
      >
        <ChangePasswordForm
          onSuccess={() => setShowPasswordModal(false)}
          onCancel={() => setShowPasswordModal(false)}
        />
      </KuModal>

      <KuModal
        show={showDeleteModal}
        title="Confirmar Exclusão"
        onClose={() => setShowDeleteModal(false)}
      >
        <DeleteAccountConfirm
          onSuccess={() => setShowDeleteModal(false)}
          onCancel={() => setShowDeleteModal(false)}
        />
      </KuModal>
    </div>
  );
}
