import { useState, useEffect } from "react";
import { invitationsService } from "@/services/invitationsService";
import { useToast } from "./useToast";
import type { IInvitation, IInvitationFilters } from "@/models/invitations";

export const useInvitations = () => {
  const [invitations, setInvitations] = useState<IInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();

  const fetchInvitations = async (filters: IInvitationFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      const response = await invitationsService.getInvitations(filters);
      setInvitations(response.data || []);
    } catch (err: any) {
      const errorMessage = err.message || "Erro ao carregar convites";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return {
    invitations,
    loading,
    error,
    fetchInvitations,
  };
};
