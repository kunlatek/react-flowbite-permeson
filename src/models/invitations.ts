export interface IInvitation {
  _id?: string;
  id?: string;
  email: string;
  accepted: boolean;
  roleId: string;
  workspaceId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// Interface para compatibilidade com KuDataTable
export interface IInvitationTable extends IInvitation {
  _id: string;
}

export interface ICreateInvitation {
  email: string;
  roleId: string;
  workspaceId: string;
  createdBy: string;
}

export interface IUpdateInvitation {
  email?: string;
  roleId?: string;
  accepted?: boolean;
}

export interface IInvitationsResponse {
  data: IInvitation[];
  limit: number;
  message: string;
  page: number;
  statusCode: number;
  total: number;
}

export interface IInvitationFormData {
  email: string;
  roleId: string;
}

export interface IInvitationFilters {
  page?: number;
  limit?: number;
  email?: string;
  accepted?: boolean;
}
