import api from "@/services/api";

export const addTeamMember = async (userId: string): Promise<void> => {
  const payload: any = { userId };
  
  const response = await api.post("/workspaces/team-user", payload);
  return response.data;
};