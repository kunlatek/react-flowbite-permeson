import api from "@/services/api";

export const updateInvitation = async (
    id: string,
    invitationData: { email: string; role: string }
  ) => {
    const response = await api.put(`/invitations/${id}`, invitationData);
    return response.data;
  };