import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "../../../hooks/useToast";
import { useNavigate } from "react-router-dom";

import { useUserPermissions } from "@/hooks/useUserPermissions";

import type { IWorkspace } from "../interfaces";

import { fetchWorkspace } from "../api/fetch-workspace";
import { fetchCurrentUserProfile } from "../api/fetch-current-user-profile";
import { fetchProfilesByIds } from "../api/fetch-profiles-by-ids";
import { addTeamMember } from "../api/add-team-user";
import { removeTeamMember } from "../api/remove-team-user";

export const useWorkspace = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const gethWorkspace = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWorkspace();

      // Buscar informações do usuário atual
      try {
        const currentUser = await fetchCurrentUserProfile();
        if (currentUser) {
          data.currentUserId = currentUser.userId;
          data.currentUserType = currentUser.type;

          // Verificar se o usuário atual é o dono do workspace
          data.isOwner = String(currentUser.userId) === String(data.owner);
        }
      } catch (err: any) {
        // Não falha a operação principal se não conseguir buscar o perfil
        data.isOwner = false;
      }

      // Remove duplicados baseado no userId
      if (data.team && Array.isArray(data.team)) {
        const uniqueTeam: string[] = [...new Set(data.team)] as string[];
        data.team = uniqueTeam;

        // Buscar informações dos usuários do time
        if (uniqueTeam.length > 0) {
          try {
            const teamMembers = await fetchProfilesByIds(uniqueTeam);
            data.teamMembers = teamMembers;
          } catch (err: any) {
            console.warn('Failed to fetch team members:', err);
            // Não falha a operação principal se não conseguir buscar os nomes
          }
        }
      }

      setWorkspace(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao carregar workspace";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const addMember = async (userId: string, roleId?: string) => {
    try {
      setLoading(true);

      // Verificar se o usuário atual é o dono do workspace
      if (!workspace?.isOwner) {
        toast.error(t("workspace.not_owner_error"));
        return false;
      }

      // Verificar se o usuário já está no time
      if (workspace?.team?.includes(userId)) {
        toast.error(t("workspace.user_already_in_team"));
        return false;
      }

      await addTeamMember(userId, roleId);
      await gethWorkspace(); // Recarregar a lista com novos dados
      toast.success("Colaborador adicionado com sucesso!");
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao adicionar colaborador";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const removeMember = async (userId: string) => {
    try {
      setLoading(true);

      // Verificar se o usuário atual é o dono do workspace
      if (!workspace?.isOwner) {
        toast.error(t("workspace.not_owner_error"));
        return false;
      }

      // Verificar se não é o proprietário
      if (String(userId) === String(workspace?.owner)) {
        toast.error(t("workspace.cannot_remove_owner"));
        return false;
      }

      await removeTeamMember(userId);
      await gethWorkspace(); // Recarregar a lista
      toast.success("Colaborador removido com sucesso!");
      return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao remover colaborador";
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    gethWorkspace();
  }, []);

  const { permissions } = useUserPermissions();
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<{ userId: string; userName?: string } | null>(null);

  const handleAddMember = () => {
    navigate("/workspace/add-member");
  };

  const handleRemoveMember = async (userId: string) => {
    const success = await removeMember(userId);
    if (success) {
      setRemoveModalOpen(false);
      setUserToRemove(null);
    }
  };

  const handleRefresh = () => {
    gethWorkspace();
  };

  const openRemoveModal = (userId: string, userName?: string) => {
    setUserToRemove({ userId, userName });
    setRemoveModalOpen(true);
  };

  return {
    workspace,
    loading,
    error,
    fetchWorkspace: gethWorkspace,
    addMember,
    removeMember,
    handleAddMember,
    handleRemoveMember,
    handleRefresh,
    removeModalOpen,
    setRemoveModalOpen,
    userToRemove,
    openRemoveModal,
    permissions,
  };
};
