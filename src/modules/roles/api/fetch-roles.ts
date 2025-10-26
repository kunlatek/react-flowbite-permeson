import api from "@/services/api";
import { IRolesResponse, IRole } from "../interfaces";

export const fetchRoles = async (page: number = 1, limit: number = 10): Promise<IRolesResponse> => {
    try {
        const response = await api.get("/roles", {
            params: { page, limit }
        });
        const data = response.data;

        const _id = data._id || data.id;
        if (!_id) {
            throw new Error('Role ID is required');
        }
        const role = data.role;

        return {
            ...response.data,
            data: {
                _id,
                id: data.id || data._id,
                name: role.name,
                permissions: role.permissions || [],
                createdBy: role.createdBy,
                workspaceId: role.workspaceId || role.workspace,
                workspace: role.workspace || role.workspaceId,
                createdAt: role.createdAt,
                updatedAt: role.updatedAt,
            }
        };
    } catch (error) {
        throw error;
    }
};

export const fetchRoleById = async (id: string): Promise<IRole> => {
    try {
        const response = await api.get(`/roles/${id}`);

        let roleData;
        if (response.data && response.data.data) {
            roleData = response.data.data;
        } else {
            roleData = response.data;
        }

        const _id = roleData._id || roleData.id;
        if (!_id) {
            throw new Error('Role ID is required');
        }
        const role = roleData.role;

        return {
            _id,
            id: roleData.id || roleData._id,
            name: role.name,
            permissions: role.permissions || [],
            createdBy: role.createdBy,
            workspaceId: role.workspaceId || role.workspace,
            workspace: role.workspace || role.workspaceId,
            createdAt: role.createdAt,
            updatedAt: role.updatedAt,
        };
    } catch (error) {
        throw error;
    }
};