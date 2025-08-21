import { useState, useEffect } from "react";
import { workspaceService } from "@/services/workspaceService";
import { useToast } from "@/hooks/useToast";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface IWorkspace {
  _id: string;
  name: string;
  owner: string;
  team: string[];
  acl: Array<{
    userId: string;
    role: string;
  }>;
}

export const useMyWorkspaces = () => {
  const [workspaces, setWorkspaces] = useState<IWorkspace[]>([]);
  const [selectedWorkspaceId, setSelectedWorkspaceId] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const { updateToken } = useAuth();
  const navigate = useNavigate();

  const fetchWorkspaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await workspaceService.getMyWorkspaces();
      setWorkspaces(data);
      
      // Carregar workspace selecionado do localStorage
      const storedWorkspaceId = localStorage.getItem('selectedWorkspaceId');
      
      if (storedWorkspaceId && data.some(ws => ws._id === storedWorkspaceId)) {
        // Se o workspace salvo ainda existe, use-o
        setSelectedWorkspaceId(storedWorkspaceId);
      } else if (data.length > 0) {
        // Senão, use o primeiro workspace disponível
        const firstWorkspaceId = data[0]._id;
        setSelectedWorkspaceId(firstWorkspaceId);
        localStorage.setItem('selectedWorkspaceId', firstWorkspaceId);
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao carregar workspaces";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const switchWorkspace = async (workspaceId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Obter novo token para o workspace
      const newToken = await workspaceService.getWorkspaceToken(workspaceId);
      
      // Atualizar apenas o token na sessão
      updateToken(newToken);
      
          // Salvar workspace selecionado no localStorage
    setSelectedWorkspaceId(workspaceId);
    localStorage.setItem('selectedWorkspaceId', workspaceId);
    
    toast.success("Workspace alterado com sucesso! Recarregando página...");
    
    // Refresh da página para atualizar todos os dados
    setTimeout(() => {
      window.location.reload();
    }, 1000); // Aguarda 1 segundo para o usuário ver a mensagem
    
    return true;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao trocar workspace";
      setError(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  return {
    workspaces,
    selectedWorkspaceId,
    loading,
    error,
    fetchWorkspaces,
    switchWorkspace,
  };
};
