import api from "./api";
import type { IWorkspace, IUserSearch, ITeamMember } from "@/models/workspace";

const getWorkspace = async (): Promise<IWorkspace> => {
  const response = await api.get("/workspaces");
  
  const responseData = response.data; 
  
  return responseData?.data || { team: [] };
};

const searchUsers = async (username: string): Promise<IUserSearch[]> => {
  const response = await api.get("/profiles", {
    params: { username }
  });
  
  const responseData = response.data;
  const data = responseData?.data && Array.isArray(responseData.data) ? responseData.data : [];
  return data as IUserSearch[];
};

const addTeamMember = async (userId: string): Promise<void> => {
  const response = await api.post("/workspaces/team-user", { userId });
  return response.data;
};

const removeTeamMember = async (userId: string): Promise<void> => {
  const response = await api.delete("/workspaces/team-user", { 
    data: { userId } 
  });
  return response.data;
};

const getProfilesByIds = async (userIds: string[]): Promise<IUserSearch[]> => {
  if (!userIds || userIds.length === 0) {
    return [];
  }
  
  const idsParam = userIds.join(',');
  const url = `/profiles/ids?ids=${idsParam}`;
  
  const response = await api.get(url);
  
  const responseData = response.data;
  
  let data: IUserSearch[] = [];
  
  if (responseData?.data && Array.isArray(responseData.data)) {
    data = responseData.data;
  } else if (Array.isArray(responseData)) {
    data = responseData;
  } else if (responseData && typeof responseData === 'object') {
    data = [responseData];
  }
  
  return data as IUserSearch[];
};

const getCurrentUserProfile = async (): Promise<{ userId: string; type: 'person' | 'company' } | null> => {
  try {
    const personResponse = await api.get('/profiles/person');
    
    if (personResponse.data?.data?.userId) {
      return {
        userId: personResponse.data.data.userId,
        type: 'person'
      };
    }
  } catch (err) {
    console.log('getCurrentUserProfile - person not found, trying company');
  }
  
  try {
    const companyResponse = await api.get('/profiles/company');
    
    if (companyResponse.data?.data?.userId) {
      return {
        userId: companyResponse.data.data.userId,
        type: 'company'
      };
    }
  } catch (err) {
    console.log('getCurrentUserProfile - company not found');
  }
  
  return null;
};

const getMyWorkspaces = async (): Promise<any[]> => {
  const response = await api.get("/workspaces/my");
  return response.data.data || [];
};

const getWorkspaceToken = async (workspaceId: string): Promise<string> => {
  const response = await api.get(`/workspaces/token/${workspaceId}`);
  return response.data.data;
};

export const workspaceService = {
  getWorkspace,
  searchUsers,
  addTeamMember,
  removeTeamMember,
  getProfilesByIds,
  getCurrentUserProfile,
  getMyWorkspaces,
  getWorkspaceToken,
};
