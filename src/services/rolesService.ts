import api from "./api";
import type { IRole, ICreateRole, IUpdateRole, IRolesResponse } from "@/models/roles";

// Função para normalizar os dados da API
const normalizeRole = (data: any): IRole => {
  const _id = data._id || data.id;
  if (!_id) {
    throw new Error('Role ID is required');
  }
  const role = data.role;
  
  return {
    _id,
    id: data.id || data._id,
    name: role.name,
    permissions: role.permissions || [],
    createdBy: role.createdBy,
    workspaceId: role.workspaceId || role.workspace,
    workspace: role.workspace || role.workspaceId,
    createdAt: role.createdAt,
    updatedAt: role.updatedAt,
  };
};

export const rolesService = {
  // Get all roles with pagination
  getRoles: async (page: number = 1, limit: number = 10): Promise<IRolesResponse> => {
    try {
      const response = await api.get("/roles", {
        params: { page, limit }
      });
      
      // Normalizar os dados retornados
      const normalizedData = {
        ...response.data,
        data: response.data.data?.map(normalizeRole) || []
      };
      
      return normalizedData;
    } catch (error) {
      throw error;
    }
  },

  // Search roles by name
  searchRoles: async (query: string, page: number = 1, limit: number = 10): Promise<IRolesResponse> => {
    try {
      const response = await api.get("/roles", {
        params: { name: query, page, limit }
      });
      
      // Normalizar os dados retornados
      const normalizedData = {
        ...response.data,
        data: response.data.data?.map(normalizeRole) || []
      };
      
      return normalizedData;
    } catch (error) {
      throw error;
    }
  },

  // Get single role by ID
  getRoleById: async (id: string): Promise<IRole> => {
    try {
      const response = await api.get(`/roles/${id}`);
      
      let roleData;
      if (response.data && response.data.data) {
        roleData = response.data.data;
      } else {
        roleData = response.data;
      }
      
      return normalizeRole(roleData);
    } catch (error) {
      throw error;
    }
  },

  // Create new role
  createRole: async (roleData: ICreateRole): Promise<IRole> => {
    try {
      const response = await api.post("/roles", roleData);
      
      let createdRole;
      if (response.data && response.data.data) {
        createdRole = response.data.data;
      } else {
        createdRole = response.data;
      }
      
      return normalizeRole(createdRole);
    } catch (error) {
      throw error;
    }
  },

  // Update role
  updateRole: async (id: string, roleData: IUpdateRole): Promise<IRole> => {
    try {
      const response = await api.put(`/roles/${id}`, roleData);
      
      let updatedRole;
      if (response.data && response.data.data) {
        updatedRole = response.data.data;
      } else {
        updatedRole = response.data;
      }
      
      return normalizeRole(updatedRole);
    } catch (error) {
      throw error;
    }
  },

  // Delete role
  deleteRole: async (id: string): Promise<void> => {
    try {
      await api.delete(`/roles/${id}`);
    } catch (error) {
      throw error;
    }
  },
};

export default rolesService;
