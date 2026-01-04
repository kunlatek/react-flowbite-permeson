import { useState, useEffect } from "react";
import { useWorkspace } from "@/modules/workspace/hooks/use-workspace";

export interface IUserPermissions {
  defaultPermissions: boolean;

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
  canViewSettings: true, // Settings sempre visível
  canEditSettings: true,
  /* RAPIDA: DEFAULT_PERMISSIONS */
});

export const useUserPermissions = (): { permissions: IUserPermissions; loading: boolean; isOwner: boolean } => {
  const workspace = useWorkspace();
  const [userPermissions, setUserPermissions] = useState<IUserPermissions>(getDefaultPermissions());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const calculatePermissions = async () => {
      
      if (!workspace.workspace) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setUserPermissions(getDefaultPermissions());
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
    loading,
    isOwner: workspace.workspace?.isOwner || false,
  };
};
