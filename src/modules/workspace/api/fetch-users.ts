import api from "@/services/api";
import { ITeamMember } from "../interfaces";

export const fetchUsers = async (username: string): Promise<ITeamMember[]> => {
  const response = await api.get("/profiles", {
    params: { username }
  });
  
  const responseData = response.data;
  const data = responseData?.data && Array.isArray(responseData.data) ? responseData.data : [];
  return data as ITeamMember[];
};