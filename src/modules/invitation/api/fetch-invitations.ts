import { IInvitation } from "../interfaces/invitation.interface";
import api from "@/services/api";

export const fetchInvitations = async (
    params: URLSearchParams
): Promise<{ data: IInvitation[]; total: number }> => {
    const response = await api.get("/invitations", { params });
    return response.data;
};

export const fetchInvitationById = async (id: string): Promise<IInvitation> => {
    const response = await api.get(`/invitations/${id}`);
    return response.data;
};