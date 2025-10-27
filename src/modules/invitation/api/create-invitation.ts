import api from "@/services/api";

export const createInvitation = async (invitationData: {
    email: string;
    roleId: string;
}) => {
    const response = await api.post("/invitations", invitationData);
    return response.data;
};