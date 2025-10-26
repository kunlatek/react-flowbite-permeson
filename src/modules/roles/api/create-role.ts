import api from "@/services/api";
import { ICreateRole } from "../interfaces";
import { IRole } from "../interfaces";

export const createRole = async (roleData: ICreateRole): Promise<IRole> => {
    try {
        const response = await api.post("/roles", roleData);

        let data;
        if (response.data && response.data.data) {
            data = response.data.data;
        } else {
            data = response.data;
        }

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
    } catch (error) {
        throw error;
    }
};