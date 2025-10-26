import { IRole } from "./role.interface";

export interface IRolesResponse {
    data: IRole[];
    limit: number;
    message: string;
    page: number;
    statusCode: number;
    total: number;
}