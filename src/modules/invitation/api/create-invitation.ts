import api from "@/services/api";

export const createInvitation = async (invitationData: {
    email: string;
    role: string;
}) => {
    const response = await api.post("/invitations", invitationData);
    return response.data;
};