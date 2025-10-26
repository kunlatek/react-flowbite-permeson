import api from "@/services/api";
import { IWorkspace } from '../interfaces';

export const fetchWorkspace = async (): Promise<IWorkspace> => {
  const response = await api.get("/workspaces");
  
  const responseData = response.data; 
  
  return responseData?.data || { team: [] };
};