import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useToast } from "./useToast";
import { workspaceService } from "@/services/workspaceService";
import type { IWorkspace, IUserSearch, ITeamMember } from "@/models/workspace";

export const useWorkspace = () => {
  const { t } = useTranslation();
  const [workspace, setWorkspace] = useState<IWorkspace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchWorkspace = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workspaceService.getWorkspace();
      
      // Buscar informações do usuário atual
      try {
        const currentUser = await workspaceService.getCurrentUserProfile();
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
        const uniqueTeam = [...new Set(data.team)];
        data.team = uniqueTeam;
        
        // Buscar informações dos usuários do time
        if (uniqueTeam.length > 0) {
          try {
            const teamMembers = await workspaceService.getProfilesByIds(uniqueTeam);
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

  const addMember = async (userId: string) => {
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
      
      await workspaceService.addTeamMember(userId);
      await fetchWorkspace(); // Recarregar a lista com novos dados
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
      
      await workspaceService.removeTeamMember(userId);
      await fetchWorkspace(); // Recarregar a lista
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
    fetchWorkspace();
  }, []);

  return {
    workspace,
    loading,
    error,
    fetchWorkspace,
    addMember,
    removeMember,
  };
};

export const useUserSearch = () => {
  const [searchResults, setSearchResults] = useState<IUserSearch[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const toast = useToast();

  const searchUsers = useCallback(async (username: string) => {
    if (!username || username.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);
      const results = await workspaceService.searchUsers(username);
      
      // Remove duplicados baseado no userId
      const uniqueResults = results.filter((user, index, self) => 
        index === self.findIndex(u => u.userId === user.userId)
      );
      
      setSearchResults(uniqueResults);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao pesquisar usuários";
      setSearchError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSearching(false);
    }
  }, [toast]);

  return {
    searchResults,
    searching,
    searchError,
    searchUsers,
  };
};
