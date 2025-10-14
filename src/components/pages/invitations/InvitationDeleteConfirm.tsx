import React from "react";
import { useTranslation } from "react-i18next";
import KuModal from "@/components/common/KuModal";
import type { IInvitation } from "@/models/invitations";

interface InvitationDeleteConfirmProps {
  invitation: IInvitation | null;
  show: boolean;
  loading: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function InvitationDeleteConfirm({
  invitation,
  show,
  loading,
  onClose,
  onConfirm,
}: InvitationDeleteConfirmProps) {
  const { t } = useTranslation();

  if (!invitation) return null;

  return (
    <KuModal
      show={show}
      onClose={onClose}
      title={t("invitations.delete_confirm.title")}
      size="sm"
    >
      <div className="space-y-4">
        <p className="text-gray-600">
          {t("invitations.delete_confirm.message", { email: invitation.email })}
        </p>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {t("common.cancel")}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? t("common.deleting") : t("common.delete")}
          </button>
        </div>
      </div>
    </KuModal>
  );
}
