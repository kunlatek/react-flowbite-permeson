import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import KuDataTable, { type IColumn, type IAction, type IHeaderAction } from "@/components/data/KuDataTable";
import { useToast } from "@/hooks/useToast";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { invitationsService } from "@/services/invitationsService";
import InvitationDeleteConfirm from "@/components/pages/invitations/InvitationDeleteConfirm";
import type { IInvitation, IInvitationsResponse, IInvitationTable } from "@/models/invitations";

export default function InvitationsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { workspace } = useWorkspace();
  const { permissions } = useUserPermissions();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [invitationToDelete, setInvitationToDelete] = useState<IInvitation | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState<string | null>(null);

  const handleView = (invitation: IInvitationTable) => {
    navigate(`/invitations/${invitation._id}`);
  };

  const canEditInvitation = (invitation: IInvitationTable) => {
    if (!workspace?.currentUserId) return false;
    
    const isOwner = workspace.isOwner;
    const isCreator = String(invitation.createdBy) === String(workspace.currentUserId);
    
    return isOwner || isCreator;
  };

  const canResendInvitation = (invitation: IInvitationTable) => {
    // Só pode reenviar convites pendentes
    if (invitation.accepted) return false;
    
    // Verifica se o usuário tem permissão para editar convites
    return canEditInvitation(invitation);
  };

  const handleDeleteClick = (invitation: IInvitationTable) => {
    setInvitationToDelete(invitation);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!invitationToDelete) return;

    setDeleteLoading(true);
    try {
      await invitationsService.deleteInvitation(invitationToDelete._id || invitationToDelete.id || '');
      toast.success(t("invitations.delete_success"));
      setDeleteModalOpen(false);
      setInvitationToDelete(null);
    } catch (err: any) {
      toast.error(err.message || t("invitations.error.delete_failed"));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setInvitationToDelete(null);
  };

  const handleResendInvitation = async (invitation: IInvitationTable) => {
    const invitationId = invitation._id || invitation.id || '';
    if (!invitationId) {
      toast.error(t("invitations.error.invalid_id"));
      return;
    }

    setResendLoading(invitationId);
    try {
      await invitationsService.resendInvitation(invitationId);
      toast.success(t("invitations.resend_success"));
    } catch (err: any) {
      toast.error(err.message || t("invitations.error.resend_failed"));
    } finally {
      setResendLoading(null);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        console.warn("Invalid date string:", dateString);
        return "Data inválida";
      }
      
      return date.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch (error) {
      console.error("Error formatting date:", error, dateString);
      return "Data inválida";
    }
  };

  const formatStatus = (accepted: boolean) => {
    return accepted ? t("invitations.status.accepted") : t("invitations.status.pending");
  };

  // Função para buscar dados compatível com KuDataTable
  const fetchInvitations = async (params: URLSearchParams) => {
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || 10;
    const email = params.get("email") || undefined;
    const accepted = params.get("accepted");
    
    const filters = {
      page,
      limit,
      email,
      accepted: accepted ? accepted === "true" : undefined,
    };
    
    const response: IInvitationsResponse = await invitationsService.getInvitations(filters);
    
    // Garantir que todos os dados têm _id para compatibilidade com KuDataTable
    const normalizedData: IInvitationTable[] = (response.data || []).map(invitation => ({
      ...invitation,
      _id: invitation._id || invitation.id || ''
    })).filter(invitation => invitation._id); // Filtrar apenas invitations com _id válido
    
    return {
      data: normalizedData,
      total: response.total || 0,
    };
  };

  // Definição das colunas da tabela
  const columns: IColumn<IInvitationTable>[] = [
    {
      key: "email",
      header: t("invitations.form.email"),
      sortable: true,
    },
    {
      key: "accepted",
      header: t("invitations.status.title"),
      sortable: true,
      formatValue: (value) => formatStatus(value as boolean),
    },
    {
      key: "createdAt",
      header: t("invitations.created_at"),
      sortable: true,
      formatValue: (value) => formatDate(value as string),
    },
  ];

  // Definição das ações da tabela
  const getActions = (invitation: IInvitationTable): IAction<IInvitationTable>[] => {
    const baseActions: IAction<IInvitationTable>[] = [];

    // Adicionar ação de reenvio se o convite for pendente e o usuário tiver permissão
    if (canResendInvitation(invitation) && permissions.canEditInvitations) {
      const isResending = resendLoading === (invitation._id || invitation.id);
      baseActions.push({
        label: isResending ? t("invitations.resending") || "Reenviando..." : t("invitations.resend"),
        color: "secondary",
        handler: handleResendInvitation,
      });
    }

    // Adicionar ações de editar e deletar apenas se o usuário tiver permissão
    if (canEditInvitation(invitation)) {
      if (permissions.canEditInvitations) {
        baseActions.push({
          label: t("invitations.edit"),
          color: "primary",
          handler: (invitation) => navigate(`/invitations/${invitation._id}/edit`),
        });
      }
      
      if (permissions.canDeleteInvitations) {
        baseActions.push({
          label: t("invitations.delete"),
          color: "danger",
          handler: handleDeleteClick,
        });
      }
    }

    return baseActions;
  };

  // Ações do header
  const headerActions: IHeaderAction[] = [];
  
  if (permissions.canCreateInvitations) {
    headerActions.push({
      label: t("invitations.new_invitation"),
      color: "primary",
      handler: () => navigate("/invitations/new"),
    });
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <KuDataTable<IInvitationTable>
          title={t("invitations.title")}
          columns={columns}
          dataSource={fetchInvitations}
          getActions={getActions}
          headerActions={headerActions}
          pageSize={10}
        />
      </div>

      {/* Modal de confirmação de exclusão */}
      <InvitationDeleteConfirm
        invitation={invitationToDelete}
        show={deleteModalOpen}
        loading={deleteLoading}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
