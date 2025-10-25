import { useState, useEffect } from "react";
import { useWorkspace } from "../features/workspace/hooks/use-workspace";
import { fetchRoles } from "@/features/roles/api/fetch-roles";

import type { IRole } from "@/features/roles/interfaces";
import type { IPermission } from "@/features/roles/interfaces/permission.interface";

export interface IUserPermissions {
  canViewPosts: boolean;
  canCreatePosts: boolean;
  canEditPosts: boolean;
  canDeletePosts: boolean;
  canViewRoles: boolean;
  canCreateRoles: boolean;
  canEditRoles: boolean;
  canDeleteRoles: boolean;
  canViewUsers: boolean;
  canCreateUsers: boolean;
  canEditUsers: boolean;
  canDeleteUsers: boolean;
  canViewWorkspaces: boolean;
  canCreateWorkspaces: boolean;
  canEditWorkspaces: boolean;
  canDeleteWorkspaces: boolean;
  canViewInvitations: boolean;
  canCreateInvitations: boolean;
  canEditInvitations: boolean;
  canDeleteInvitations: boolean;
  canViewProfiles: boolean;
  canCreateProfiles: boolean;
  canEditProfiles: boolean;
  canDeleteProfiles: boolean;
  canViewSettings: boolean;
  canEditSettings: boolean;
}

const getDefaultPermissions = (): IUserPermissions => ({
  canViewPosts: false,
  canCreatePosts: false,
  canEditPosts: false,
  canDeletePosts: false,
  canViewRoles: false,
  canCreateRoles: false,
  canEditRoles: false,
  canDeleteRoles: false,
  canViewUsers: false,
  canCreateUsers: false,
  canEditUsers: false,
  canDeleteUsers: false,
  canViewWorkspaces: false,
  canCreateWorkspaces: false,
  canEditWorkspaces: false,
  canDeleteWorkspaces: false,
  canViewInvitations: false,
  canCreateInvitations: false,
  canEditInvitations: false,
  canDeleteInvitations: false,
  canViewProfiles: false,
  canCreateProfiles: false,
  canEditProfiles: false,
  canDeleteProfiles: false,
  canViewSettings: true, // Settings sempre visível
  canEditSettings: false,
});

const hasPermission = (permissions: IPermission[], module: string, action: string): boolean => {
  const modulePermission = permissions.find(p => p.module === module);
  if (!modulePermission) return false;
  
  return modulePermission.actionList.includes(action);
};

export const useUserPermissions = (): { permissions: IUserPermissions; userRole: IRole | null; loading: boolean; isOwner: boolean } => {
  const workspace = useWorkspace();
  const [userPermissions, setUserPermissions] = useState<IUserPermissions>(getDefaultPermissions());
  const [userRole, setUserRole] = useState<IRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [roles, setRoles] = useState<IRole[]>([]);

  useEffect(() => {
    const calculatePermissions = async () => {
      
      if (!workspace.workspace) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Se é owner do workspace, tem todas as permissões
        if (workspace.workspace?.isOwner) {
          const ownerPermissions: IUserPermissions = {
            canViewPosts: true,
            canCreatePosts: true,
            canEditPosts: true,
            canDeletePosts: true,
            canViewRoles: true,
            canCreateRoles: true,
            canEditRoles: true,
            canDeleteRoles: true,
            canViewUsers: true,
            canCreateUsers: true,
            canEditUsers: true,
            canDeleteUsers: true,
            canViewWorkspaces: true,
            canCreateWorkspaces: true,
            canEditWorkspaces: true,
            canDeleteWorkspaces: true,
            canViewInvitations: true,
            canCreateInvitations: true,
            canEditInvitations: true,
            canDeleteInvitations: true,
            canViewProfiles: true,
            canCreateProfiles: true,
            canEditProfiles: true,
            canDeleteProfiles: true,
            canViewSettings: true,
            canEditSettings: true,
          };
          
          setUserPermissions(ownerPermissions);
          setUserRole(null); // Owner não tem role específica
          setLoading(false);
          return;
        }

        // Buscar a role do usuário atual no workspace
        const currentUserId = workspace.workspace?.currentUserId;
        if (!currentUserId) {
          setUserPermissions(getDefaultPermissions());
          setLoading(false);
          return;
        }

        // Buscar roles diretamente da API
        const rolesResponse = await fetchRoles(1, 100);
        const availableRoles = rolesResponse.data || [];

        // Se não há roles disponíveis, usar permissões padrão
        if (!availableRoles || availableRoles.length === 0) {
          setUserPermissions(getDefaultPermissions());
          setUserRole(null);
          setLoading(false);
          return;
        }

        // Buscar a role do usuário atual no workspace
        // Por enquanto, vamos simular com a primeira role disponível
        // Em uma implementação real, você teria um endpoint específico para isso
        const userRole = availableRoles.find((role: IRole) => {
          // Lógica simplificada: se o usuário criou a role ou se é a primeira role
          return role.createdBy === currentUserId || role._id === availableRoles[0]._id;
        });

        if (!userRole) {
          setUserPermissions(getDefaultPermissions());
          setUserRole(null);
          setLoading(false);
          return;
        }

        setUserRole(userRole);

        // Calcular permissões baseadas na role
        const permissions: IUserPermissions = {
          // Posts
          canViewPosts: hasPermission(userRole.permissions, 'posts', 'findAll'),
          canCreatePosts: hasPermission(userRole.permissions, 'posts', 'create'),
          canEditPosts: hasPermission(userRole.permissions, 'posts', 'update'),
          canDeletePosts: hasPermission(userRole.permissions, 'posts', 'delete'),
          
          // Roles
          canViewRoles: hasPermission(userRole.permissions, 'roles', 'findAll'),
          canCreateRoles: hasPermission(userRole.permissions, 'roles', 'create'),
          canEditRoles: hasPermission(userRole.permissions, 'roles', 'update'),
          canDeleteRoles: hasPermission(userRole.permissions, 'roles', 'delete'),
          
          // Users
          canViewUsers: hasPermission(userRole.permissions, 'users', 'findAll'),
          canCreateUsers: hasPermission(userRole.permissions, 'users', 'create'),
          canEditUsers: hasPermission(userRole.permissions, 'users', 'update'),
          canDeleteUsers: hasPermission(userRole.permissions, 'users', 'delete'),
          
          // Workspaces
          canViewWorkspaces: hasPermission(userRole.permissions, 'workspaces', 'findAll'),
          canCreateWorkspaces: hasPermission(userRole.permissions, 'workspaces', 'create'),
          canEditWorkspaces: hasPermission(userRole.permissions, 'workspaces', 'update'),
          canDeleteWorkspaces: hasPermission(userRole.permissions, 'workspaces', 'delete'),
          
          // Invitations
          canViewInvitations: hasPermission(userRole.permissions, 'invitations', 'findAll'),
          canCreateInvitations: hasPermission(userRole.permissions, 'invitations', 'create'),
          canEditInvitations: hasPermission(userRole.permissions, 'invitations', 'update'),
          canDeleteInvitations: hasPermission(userRole.permissions, 'invitations', 'delete'),
          
          // Profiles
          canViewProfiles: hasPermission(userRole.permissions, 'profiles', 'findAll'),
          canCreateProfiles: hasPermission(userRole.permissions, 'profiles', 'create'),
          canEditProfiles: hasPermission(userRole.permissions, 'profiles', 'update'),
          canDeleteProfiles: hasPermission(userRole.permissions, 'profiles', 'delete'),
          
          // Settings (sempre visível)
          canViewSettings: true,
          canEditSettings: hasPermission(userRole.permissions, 'settings', 'update'),
        };

        setUserPermissions(permissions);
      } catch (error) {
        console.error('Error calculating permissions:', error);
        setUserPermissions(getDefaultPermissions());
      } finally {
        setLoading(false);
      }
    };

    calculatePermissions();
  }, [workspace.workspace?.isOwner, workspace.workspace?.currentUserId]);

  return {
    permissions: userPermissions,
    userRole,
    loading,
    isOwner: workspace.workspace?.isOwner || false,
  };
};
