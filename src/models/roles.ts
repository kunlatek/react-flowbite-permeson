export interface IPermission {
  module: string;
  actionList: string[];
}

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

// Interface para compatibilidade com KuDataTable
export interface IRoleTable extends IRole {
  _id: string;
}

export interface ICreateRole {
  name: string;
  permissions: IPermission[];
  createdBy: string;
  workspaceId: string;
}

export interface IUpdateRole {
  name?: string;
  permissions?: IPermission[];
}

export interface IRolesResponse {
  data: IRole[];
  limit: number;
  message: string;
  page: number;
  statusCode: number;
  total: number;
}

export interface IRoleFormData {
  name: string;
  permissions: IPermission[];
}

// Available modules and actions for the permissions
export const AVAILABLE_MODULES = [
  'posts',
  'users',
  'roles',
  'workspaces',
  'invitations',
  'profiles',
  'settings'
] as const;

export const AVAILABLE_ACTIONS = [
  'findAll',
  'findOne',
  'create',
  'update',
  'delete'
] as const;

export type ModuleType = typeof AVAILABLE_MODULES[number];
export type ActionType = typeof AVAILABLE_ACTIONS[number];
