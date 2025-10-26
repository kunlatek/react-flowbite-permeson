import { IPermission } from "./permission.interface";

export interface IRoleFormData {
    name: string;
    permissions: IPermission[];
}