import api from "@/services/api";

export const sendInvitation = async (id: string) => {
    const response = await api.post(`/invitations/${id}/resend`);
    return response.data;
};