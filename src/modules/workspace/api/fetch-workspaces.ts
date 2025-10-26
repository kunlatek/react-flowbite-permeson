import api from "@/services/api";

export const fetchWorkspaces = async (): Promise<any[]> => {
  const response = await api.get("/workspaces/my");
  return response.data.data || [];
};