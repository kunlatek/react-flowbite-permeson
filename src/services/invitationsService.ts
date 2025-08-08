import api from "./api";
import type { IInvitation } from "@/models/invitation";

const createInvitation = async (invitationData: {
  email: string;
  role: string;
}) => {
  const response = await api.post("/invitations", invitationData);
  return response.data;
};

const getInvitations = async (
  params: URLSearchParams
): Promise<{ data: IInvitation[]; total: number }> => {
  const response = await api.get("/invitations", { params });
  return response.data;
};

const getInvitationById = async (id: string): Promise<IInvitation> => {
  const response = await api.get(`/invitations/${id}`);
  return response.data;
};

const updateInvitation = async (
  id: string,
  invitationData: { email: string; role: string }
) => {
  const response = await api.put(`/invitations/${id}`, invitationData);
  return response.data;
};

const deleteInvitation = async (id: string) => {
  const response = await api.delete(`/invitations/${id}`);
  return response.data;
};

const sendInvitation = async (id: string) => {
  const response = await api.post(`/invitations/${id}/resend`);
  return response.data;
};

export const invitationsService = {
  createInvitation,
  getInvitations,
  getInvitationById,
  updateInvitation,
  deleteInvitation,
  sendInvitation,
};
