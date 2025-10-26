import api from "@/services/api";
import { ITeamMember } from "../interfaces";

export const fetchProfilesByIds = async (userIds: string[]): Promise<ITeamMember[]> => {
  if (!userIds || userIds.length === 0) {
    return [];
  }
  
  const idsParam = userIds.join(',');
  const url = `/profiles/ids?ids=${idsParam}`;
  
  const response = await api.get(url);
  
  const responseData = response.data;
  
  let data: ITeamMember[] = [];
  
  if (responseData?.data && Array.isArray(responseData.data)) {
    data = responseData.data;
  } else if (Array.isArray(responseData)) {
    data = responseData;
  } else if (responseData && typeof responseData === 'object') {
    data = [responseData];
  }
  
  return data as ITeamMember[];
};