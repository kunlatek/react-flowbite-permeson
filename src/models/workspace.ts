export interface IWorkspace {
  id: number;
  _id: string;
  owner: string;
  team: string[];
  teamMembers?: IUserSearch[]; // Informações dos usuários do time
  currentUserId?: string; // ID do usuário atual (dono)
  currentUserType?: 'person' | 'company'; // Tipo do perfil atual
  isOwner?: boolean; // Se o usuário atual é o dono do workspace
  acl: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IUserSearch {
  userId: string;
  userName: string;
}

export interface ITeamMember {
  userId: string;
  userName?: string;
}
