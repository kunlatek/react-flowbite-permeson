import api from "./api";
import type { IInvitation, ICreateInvitation, IUpdateInvitation, IInvitationsResponse, IInvitationFilters } from "@/models/invitations";

// Função para normalizar os dados da API
const normalizeInvitation = (data: any): IInvitation => {
  const _id = data._id || data.id;
  if (!_id) {
    throw new Error('Invitation ID is required');
  }
  
  return {
    _id,
    id: data.id || data._id,
    email: data.email,
    accepted: data.accepted,
    roleId: data.roleId,
    workspaceId: data.workspaceId,
    createdBy: data.createdBy,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const invitationsService = {
  // Get all invitations with pagination and filters
  getInvitations: async (filters: IInvitationFilters = {}): Promise<IInvitationsResponse> => {
    try {
      const { page = 1, limit = 10, email, accepted } = filters;
      
      const params: any = { page, limit };
      if (email) params.email = email;
      if (accepted !== undefined) params.accepted = accepted;
      
      const response = await api.get("/invitations", { params });
      
      // Normalizar os dados retornados
      const normalizedData = {
        ...response.data,
        data: response.data.data?.map(normalizeInvitation) || []
      };
      
      return normalizedData;
    } catch (error) {
      throw error;
    }
  },

  // Get single invitation by ID
  getInvitationById: async (id: string): Promise<IInvitation> => {
    try {
      const response = await api.get(`/invitations/${id}`);
      
      let invitationData;
      if (response.data && response.data.data) {
        invitationData = response.data.data;
      } else {
        invitationData = response.data;
      }
      
      return normalizeInvitation(invitationData);
    } catch (error) {
      throw error;
    }
  },

  // Create new invitation
  createInvitation: async (invitationData: ICreateInvitation): Promise<IInvitation> => {
    try {
      const response = await api.post("/invitations", invitationData);
      
      let createdInvitation;
      if (response.data && response.data.data) {
        createdInvitation = response.data.data;
      } else {
        createdInvitation = response.data;
      }
      
      return normalizeInvitation(createdInvitation);
    } catch (error) {
      throw error;
    }
  },

  // Update invitation
  updateInvitation: async (id: string, invitationData: IUpdateInvitation): Promise<IInvitation> => {
    try {
      const response = await api.put(`/invitations/${id}`, invitationData);
      
      let updatedInvitation;
      if (response.data && response.data.data) {
        updatedInvitation = response.data.data;
      } else {
        updatedInvitation = response.data;
      }
      
      return normalizeInvitation(updatedInvitation);
    } catch (error) {
      throw error;
    }
  },

  // Delete invitation
  deleteInvitation: async (id: string): Promise<void> => {
    try {
      await api.delete(`/invitations/${id}`);
    } catch (error) {
      throw error;
    }
  },

  // Resend invitation email
  resendInvitation: async (id: string): Promise<void> => {
    try {
      await api.post(`/invitations/${id}/resend`);
    } catch (error) {
      throw error;
    }
  },
};

export default invitationsService;