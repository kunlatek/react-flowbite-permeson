import { useState, useEffect } from "react";
import { rolesService } from "@/services/rolesService";
import { useToast } from "./useToast";
import type { IRole } from "@/models/roles";

export const useRoles = () => {
  const [roles, setRoles] = useState<IRole[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchRoles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await rolesService.getRoles(1, 100); // Buscar todas as roles
      setRoles(response.data || []);
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao carregar papéis";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  return {
    roles,
    loading,
    error,
    fetchRoles,
  };
};
