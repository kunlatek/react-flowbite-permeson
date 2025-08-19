import api from "./api";
import type { IWorkspace, IUserSearch, ITeamMember } from "@/models/workspace";

const getWorkspace = async (): Promise<IWorkspace> => {
  const response = await api.get("/workspaces");
  
  // A API retorna { statusCode, message, data: {...} }
  const responseData = response.data;
  console.log('getWorkspace - response data:', responseData); // Debug log
  
  // Retorna o objeto data dentro da resposta
  return responseData?.data || { team: [] };
};

const searchUsers = async (username: string): Promise<IUserSearch[]> => {
  const response = await api.get("/profiles", {
    params: { username }
  });
  
  // A API retorna { statusCode, message, data: [...] }
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
  console.log('getProfilesByIds - URL:', url); // Debug log
  
  const response = await api.get(url);
  
  console.log('getProfilesByIds - response:', response.data); // Debug log
  
  // A API pode retornar diferentes estruturas
  const responseData = response.data;
  console.log('getProfilesByIds - full response data:', responseData); // Debug log
  
  let data: IUserSearch[] = [];
  
  // Tenta diferentes estruturas de resposta
  if (responseData?.data && Array.isArray(responseData.data)) {
    // Estrutura: { statusCode, message, data: [...] }
    data = responseData.data;
  } else if (Array.isArray(responseData)) {
    // Estrutura: [...] (array direto)
    data = responseData;
  } else if (responseData && typeof responseData === 'object') {
    // Estrutura: { userId, userName } (objeto único)
    data = [responseData];
  }
  
  console.log('getProfilesByIds - final data:', data); // Debug log
  return data as IUserSearch[];
};

const getCurrentUserProfile = async (): Promise<{ userId: string; type: 'person' | 'company' } | null> => {
  try {
    // Tenta buscar perfil pessoal primeiro
    const personResponse = await api.get('/profiles/person');
    console.log('getCurrentUserProfile - person response:', personResponse.data);
    
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
    // Se não encontrar perfil pessoal, tenta perfil empresarial
    const companyResponse = await api.get('/profiles/company');
    console.log('getCurrentUserProfile - company response:', companyResponse.data);
    
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

export const workspaceService = {
  getWorkspace,
  searchUsers,
  addTeamMember,
  removeTeamMember,
  getProfilesByIds,
  getCurrentUserProfile,
};
