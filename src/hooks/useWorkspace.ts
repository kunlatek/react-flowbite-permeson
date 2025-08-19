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
      
      console.log('Workspace data received:', data); // Debug log
      
      // Buscar informações do usuário atual
      try {
        const currentUser = await workspaceService.getCurrentUserProfile();
        if (currentUser) {
          data.currentUserId = currentUser.userId;
          data.currentUserType = currentUser.type;
          console.log('Current user profile:', currentUser); // Debug log
        }
      } catch (err: any) {
        console.warn('Failed to fetch current user profile:', err);
        // Não falha a operação principal se não conseguir buscar o perfil
      }
      
      // Remove duplicados baseado no userId
      if (data.team && Array.isArray(data.team)) {
        const uniqueTeam = [...new Set(data.team)];
        data.team = uniqueTeam;
        console.log('Team after deduplication:', data.team); // Debug log
        
        // Buscar informações dos usuários do time
        if (uniqueTeam.length > 0) {
          try {
            const teamMembers = await workspaceService.getProfilesByIds(uniqueTeam);
            data.teamMembers = teamMembers;
            console.log('Team members fetched:', teamMembers); // Debug log
          } catch (err: any) {
            console.warn('Failed to fetch team members:', err);
            // Não falha a operação principal se não conseguir buscar os nomes
          }
        }
      }
      
      setWorkspace(data);
      console.log('Workspace state set:', data); // Debug log
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
      
      // Verificar se não é o proprietário
      if (String(userId) === String(workspace?.currentUserId)) {
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
      
      console.log('Search results:', results); // Debug log
      
      // Remove duplicados baseado no userId
      const uniqueResults = results.filter((user, index, self) => 
        index === self.findIndex(u => u.userId === user.userId)
      );
      
      console.log('Unique results:', uniqueResults); // Debug log
      
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
