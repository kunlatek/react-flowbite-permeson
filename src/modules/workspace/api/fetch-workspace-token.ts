import api from "@/services/api";

export const fetchWorkspaceToken = async (workspaceId: string): Promise<string> => {
  const response = await api.get(`/workspaces/${workspaceId}/token`);
  return response.data.data;
};