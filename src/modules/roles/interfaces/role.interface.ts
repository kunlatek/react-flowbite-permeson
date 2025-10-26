import { IPermission } from "./permission.interface";

export interface IRole {
  _id?: string;
  id?: string;
  name: string;
  permissions: IPermission[];
  createdBy: string;
  workspaceId?: string;
  workspace?: string;
  createdAt: string;
  updatedAt: string;
}
