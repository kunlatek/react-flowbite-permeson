import api from "@/services/api";
import { IUpdateRole } from "../interfaces";
import { IRole } from "../interfaces";

export const updateRole = async (id: string, roleData: IUpdateRole): Promise<IRole> => {
    try {
        const response = await api.put(`/roles/${id}`, roleData);

        let updatedRole;
        if (response.data && response.data.data) {
            updatedRole = response.data.data;
        } else {
            updatedRole = response.data;
        }

        return {
            _id: updatedRole._id || updatedRole.id,
            id: updatedRole.id || updatedRole._id,
            name: updatedRole.name,
            permissions: updatedRole.permissions || [],
            createdBy: updatedRole.createdBy,
            workspaceId: updatedRole.workspaceId || updatedRole.workspace,
            workspace: updatedRole.workspace || updatedRole.workspaceId,
            createdAt: updatedRole.createdAt,
            updatedAt: updatedRole.updatedAt,
        };
    } catch (error) {
        throw error;
    }
};