import { IPermission } from "./permission.interface";

export interface IUpdateRole {
    name?: string;
    permissions?: IPermission[];
}