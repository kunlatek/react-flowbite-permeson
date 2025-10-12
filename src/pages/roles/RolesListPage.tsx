import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import KuDataTable, { type IColumn, type IAction, type IHeaderAction } from "@/components/data/KuDataTable";
import { useToast } from "@/hooks/useToast";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useUserPermissions } from "@/hooks/useUserPermissions";
import { rolesService } from "@/services/rolesService";
import RoleDeleteConfirm from "@/components/pages/roles/RoleDeleteConfirm";
import type { IRole, IRolesResponse, IRoleTable } from "@/models/roles";

export default function RolesListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { workspace } = useWorkspace();
  const { permissions } = useUserPermissions();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<IRole | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const handleView = (role: IRoleTable) => {
    navigate(`/roles/${role._id}`);
  };

  const canEditRole = (role: IRoleTable) => {
    if (!workspace?.currentUserId) return false;
    
    const isOwner = workspace.isOwner;
    const isCreator = String(role.createdBy) === String(workspace.currentUserId);
    
    return isOwner || isCreator;
  };

  const handleDeleteClick = (role: IRoleTable) => {
    setRoleToDelete(role);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!roleToDelete) return;

    setDeleteLoading(true);
    try {
      await rolesService.deleteRole(roleToDelete._id || roleToDelete.id || '');
      toast.success(t("roles.delete_success"));
      setDeleteModalOpen(false);
      setRoleToDelete(null);
    } catch (err: any) {
      toast.error(err.message || t("roles.error.delete_failed"));
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModalOpen(false);
    setRoleToDelete(null);
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

  const formatPermissions = (permissions: any[]) => {
    if (!permissions || permissions.length === 0) return "-";
    return `${permissions.length} módulo${permissions.length > 1 ? 's' : ''}`;
  };

  // Função para buscar dados compatível com KuDataTable
  const fetchRoles = async (params: URLSearchParams) => {
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || 10;
    
    const response: IRolesResponse = await rolesService.getRoles(page, limit);
    
    // Garantir que todos os dados têm _id para compatibilidade com KuDataTable
    const normalizedData: IRoleTable[] = (response.data || []).map(role => ({
      ...role,
      _id: role._id || role.id || ''
    })).filter(role => role._id); // Filtrar apenas roles com _id válido
    
    return {
      data: normalizedData,
      total: response.total || 0,
    };
  };

  // Definição das colunas da tabela
  const columns: IColumn<IRoleTable>[] = [
    {
      key: "name",
      header: t("roles.form.name"),
      sortable: true,
    },
    {
      key: "permissions",
      header: t("roles.permissions"),
      sortable: false,
      formatValue: (value) => formatPermissions(value as any[]),
    },
    {
      key: "createdAt",
      header: t("roles.created_at"),
      sortable: true,
      formatValue: (value) => formatDate(value as string),
    },
  ];

  // Definição das ações da tabela
  const getActions = (role: IRoleTable): IAction<IRoleTable>[] => {
    const baseActions: IAction<IRoleTable>[] = [];

    // Adicionar ações de editar e deletar apenas se o usuário tiver permissão
    if (canEditRole(role)) {
      if (permissions.canEditRoles) {
        baseActions.push({
          label: t("roles.edit"),
          color: "primary",
          handler: (role) => navigate(`/roles/${role._id}/edit`),
        });
      }
      
      if (permissions.canDeleteRoles) {
        baseActions.push({
          label: t("roles.delete"),
          color: "danger",
          handler: handleDeleteClick,
        });
      }
    }

    return baseActions;
  };

  // Ações do header
  const headerActions: IHeaderAction[] = [];
  
  if (permissions.canCreateRoles) {
    headerActions.push({
      label: t("roles.new_role"),
      color: "primary",
      handler: () => navigate("/roles/new"),
    });
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <KuDataTable<IRoleTable>
          title={t("roles.title")}
          columns={columns}
          dataSource={fetchRoles}
          getActions={getActions}
          headerActions={headerActions}
          pageSize={10}
        />
      </div>

      {/* Modal de confirmação de exclusão */}
      <RoleDeleteConfirm
        role={roleToDelete}
        show={deleteModalOpen}
        loading={deleteLoading}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}
