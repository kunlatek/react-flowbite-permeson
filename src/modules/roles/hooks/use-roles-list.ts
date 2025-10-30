import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { IColumn, IAction, IHeaderAction } from "@/interfaces/ku-components/ku-data-table.interface";

import { IRole, IRolesResponse, IRoleTable } from "../interfaces";

import { useWorkspace } from "@/modules/workspace/hooks/use-workspace";

import { fetchRoles } from "../api/fetch-roles";
import { deleteRole } from "../api/delete-role";

// import { rolesService } from "@/services/rolesService";

export const useRolesList = (permissions?: any) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();
    const { workspace } = useWorkspace();
    const [roles, setRoles] = useState<IRole[]>([]);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [roleToDelete, setRoleToDelete] = useState<IRole | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [rolesLoading, setRolesLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    
    const loadRoles = async () => {
        setRolesLoading(true);
        try {
            const response: IRolesResponse = await fetchRoles(1, 10);
            setRoles(response.data || []);
        } catch (error) {
            console.error('Error loading roles:', error);
        } finally {
            setRolesLoading(false);
        }
    };
    
    useEffect(() => {
        loadRoles();
    }, []);

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
            await deleteRole(roleToDelete._id || roleToDelete.id || '');
            toast.success(t("roles.delete_success"));
            setDeleteModalOpen(false);
            setRoleToDelete(null);
            
            // Trigger refresh of the data table
            setRefreshTrigger(prev => prev + 1);
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
    const getRoles = async (params: URLSearchParams) => {
        const page = Number(params.get("page")) || 1;
        const limit = Number(params.get("limit")) || 10;

        const response: IRolesResponse = await fetchRoles(page, limit);

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
            formatValue: (value: unknown, row: IRoleTable) => formatPermissions(value as any[]),
        },
        {
            key: "createdAt",
            header: t("roles.created_at"),
            sortable: true,
            formatValue: (value: unknown, row: IRoleTable) => formatDate(value as string),
        },
    ];

    // Definição das ações da tabela
    const getActions = (role: IRoleTable): IAction<IRoleTable>[] => {
        const baseActions: IAction<IRoleTable>[] = [];

        // Adicionar ações de editar e deletar apenas se o usuário tiver permissão
        if (canEditRole(role)) {
            if (permissions?.canEditRoles) {
                baseActions.push({
                    label: t("roles.edit"),
                    color: "primary",
                    handler: (role: IRoleTable) => navigate(`/roles/${role._id}/edit`),
                });
            }

            if (permissions?.canDeleteRoles) {
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
    
    if (permissions?.canCreateRoles) {
        headerActions.push({
            label: t("roles.new_role"),
            color: "primary",
            handler: () => navigate("/roles/new"),
        });
    }

    return {
        columns,
        getActions,
        headerActions,
        getRoles,
        roles,
        handleDeleteConfirm,
        handleDeleteCancel,
        deleteModalOpen,
        roleToDelete,
        deleteLoading,
        rolesLoading,
        loadRoles,
        refreshTrigger,
    }
}