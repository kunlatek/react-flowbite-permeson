import { ITeamMember } from ".";

export interface IWorkspace {
    id: number;
    _id: string;
    name?: string;
    owner: string;
    team: string[];
    teamMembers?: ITeamMember[];
    currentUserId?: string;
    currentUserType?: 'person' | 'company';
    isOwner?: boolean;
    acl: string[];
    createdAt: string;
    updatedAt: string;
}