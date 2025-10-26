import api from "@/services/api";

export const removeTeamMember = async (userId: string): Promise<void> => {
  const response = await api.delete("/workspaces/team-user", { 
    data: { userId } 
  });
  return response.data;
};