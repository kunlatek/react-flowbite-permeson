import api from "@/services/api";

export const addTeamMember = async (userId: string, roleId?: string): Promise<void> => {
  const payload: any = { userId };
  
  if (roleId) {
    payload.roleId = roleId;
  }
  
  const response = await api.post("/workspaces/team-user", payload);
  return response.data;
};