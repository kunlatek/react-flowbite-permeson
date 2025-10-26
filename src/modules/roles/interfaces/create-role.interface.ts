import { IPermission } from "./permission.interface";

export interface ICreateRole {
    name: string;
    permissions: IPermission[];
    createdBy: string;
    workspaceId: string;
}