import { useState } from "react";
import { Card, Alert } from "flowbite-react";
import KuModal from "@/components/common/KuModal";
import { KuButton } from "@/components/form";
import DeleteAccountConfirm from "@/components/pages/settings/DeleteAccountConfirm";

export default function SettingsPage() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Configurações
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Gerencie as configurações da sua conta.
          </p>
        </div>

        <Card>
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-red-600 dark:text-red-500 mb-2">
                Exclusão de Conta
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Esta ação é irreversível após 90 dias. Todos os seus dados serão
                perdidos permanentemente.
              </p>
              <Alert color="warning" className="mb-4">
                <span className="font-medium">Atenção!</span>
                <p>
                  A exclusão da conta é um processo que pode ser revertido dentro de 90 dias.
                  Após esse período, todos os dados serão permanentemente removidos.
                </p>
              </Alert>
            </div>
            
            <KuButton
              id="delete-account-modal-btn"
              type="button"
              actionType="button"
              variant="danger"
              onClick={() => setShowDeleteModal(true)}
              label="Excluir minha conta"
              customClass="px-6 py-3"
            />
          </div>
        </Card>

        <KuModal
          show={showDeleteModal}
          title="Confirmar Exclusão da Conta"
          onClose={() => setShowDeleteModal(false)}
        >
          <DeleteAccountConfirm
            onSuccess={() => setShowDeleteModal(false)}
            onCancel={() => setShowDeleteModal(false)}
          />
        </KuModal>
      </div>
    </div>
  );
}
