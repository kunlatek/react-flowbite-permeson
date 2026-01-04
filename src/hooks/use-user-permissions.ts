import { useState, useEffect } from "react";
import { useWorkspace } from "@/modules/workspace/hooks/use-workspace";
import { fetchRoles } from "@/modules/roles/api/fetch-roles";

import type { IRole } from "@/modules/roles/interfaces";
import type { IPermission } from "@/modules/roles/interfaces/permission.interface";

export interface IUserPermissions {
  defaultPermissions: boolean;

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
  /* RAPIDA: I_USER_PERMISSIONS */
}

const getDefaultPermissions = (): IUserPermissions => ({
  defaultPermissions: true,

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
  /* RAPIDA: DEFAULT_PERMISSIONS */
});

const hasPermission = (permissions: IPermission[], module: string, action: string): boolean => {
  const modulePermission = permissions.find(p => p.module === module || p.module === 'all');
  if (!modulePermission) return false;
  
  return modulePermission.actionList.includes(action);
};

const hasPermissionFromRoles = (roles: IRole[], module: string, action: string): boolean => {
  return roles.some(role => hasPermission(role.permissions, module, action));
};

export const useUserPermissions = (): { permissions: IUserPermissions; userRole: IRole | null; loading: boolean; isOwner: boolean } => {
  const workspace = useWorkspace();
  const [userPermissions, setUserPermissions] = useState<IUserPermissions>(getDefaultPermissions());
  const [userRole, setUserRole] = useState<IRole | null>(null);
  const [loading, setLoading] = useState(true);

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
            defaultPermissions: false,

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
            /* RAPIDA: OWNER_PERMISSIONS */
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

        // Buscar todas as roles do usuário atual no workspace (pode ter múltiplas roles)
        const userAclEntries = (workspace.workspace?.acl ?? []).filter((acl: any) => acl.userId === currentUserId);
        const roleIds = userAclEntries.map((acl: any) => acl.roleId).filter((id: string) => id);
        const userRoles = availableRoles.filter((role: IRole) => roleIds.includes(role._id));

        if (!userRoles || userRoles.length === 0) {
          setUserPermissions(getDefaultPermissions());
          setUserRole(null);
          setLoading(false);
          return;
        }

        // Se houver apenas uma role, usar ela como userRole principal, senão usar a primeira
        setUserRole(userRoles[0]);

        // Calcular permissões baseadas em todas as roles (mesclar com OR logic)
        const permissions: IUserPermissions = {
          defaultPermissions: false,
          
          // Roles
          canViewRoles: hasPermissionFromRoles(userRoles, 'roles', 'findAll'),
          canCreateRoles: hasPermissionFromRoles(userRoles, 'roles', 'create'),
          canEditRoles: hasPermissionFromRoles(userRoles, 'roles', 'update'),
          canDeleteRoles: hasPermissionFromRoles(userRoles, 'roles', 'delete'),
          
          // Users
          canViewUsers: hasPermissionFromRoles(userRoles, 'users', 'findAll'),
          canCreateUsers: hasPermissionFromRoles(userRoles, 'users', 'create'),
          canEditUsers: hasPermissionFromRoles(userRoles, 'users', 'update'),
          canDeleteUsers: hasPermissionFromRoles(userRoles, 'users', 'delete'),
          
          // Workspaces
          canViewWorkspaces: hasPermissionFromRoles(userRoles, 'workspaces', 'findAll'),
          canCreateWorkspaces: hasPermissionFromRoles(userRoles, 'workspaces', 'create'),
          canEditWorkspaces: hasPermissionFromRoles(userRoles, 'workspaces', 'update'),
          canDeleteWorkspaces: hasPermissionFromRoles(userRoles, 'workspaces', 'delete'),
          
          // Invitations
          canViewInvitations: hasPermissionFromRoles(userRoles, 'invitations', 'findAll'),
          canCreateInvitations: hasPermissionFromRoles(userRoles, 'invitations', 'create'),
          canEditInvitations: hasPermissionFromRoles(userRoles, 'invitations', 'update'),
          canDeleteInvitations: hasPermissionFromRoles(userRoles, 'invitations', 'delete'),
          
          // Profiles
          canViewProfiles: hasPermissionFromRoles(userRoles, 'profiles', 'findAll'),
          canCreateProfiles: hasPermissionFromRoles(userRoles, 'profiles', 'create'),
          canEditProfiles: hasPermissionFromRoles(userRoles, 'profiles', 'update'),
          canDeleteProfiles: hasPermissionFromRoles(userRoles, 'profiles', 'delete'),
          
          // Settings (sempre visível)
          canViewSettings: true,
          canEditSettings: hasPermissionFromRoles(userRoles, 'settings', 'update'),

          /* RAPIDA: PERMISSIONS */
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
