import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITeamMember } from "../interfaces";

import { useUserSearch } from "./use-user-search";
import { useWorkspace } from "./use-workspace";
import { useRolesList } from "@/modules/roles/hooks/use-roles-list";
import { useUserPermissions } from "@/hooks/use-user-permissions";

export const useAddMember = () => {
    const navigate = useNavigate();
      const [searchTerm, setSearchTerm] = useState("");
      const [selectedUser, setSelectedUser] = useState<ITeamMember | null>(null);
      const [selectedRoleIds, setSelectedRoleIds] = useState<(string | number)[]>([]);
      const [adding, setAdding] = useState(false);
      const [success, setSuccess] = useState(false);
      
      const { searchResults, searching, searchUsers } = useUserSearch();
      const { workspace, addMember } = useWorkspace();
      const { permissions } = useUserPermissions();
      const { roles, rolesLoading } = useRolesList(permissions);
        
      useEffect(() => {
        if (searchTerm && searchTerm.length >= 2) {
          const timeoutId = setTimeout(() => {
            searchUsers(searchTerm);
          }, 300);
          
          return () => clearTimeout(timeoutId);
        } else if (searchTerm.length < 2) {
          // Limpar resultados se o termo for muito curto
          searchUsers("");
        }
      }, [searchTerm]);
    
      const handleAddMember = async () => {
        if (!selectedUser) return;
        
        setAdding(true);
        let allSuccess = true;
        
        for (const roleId of (selectedRoleIds ?? [])) {
          const success = await addMember(selectedUser.userId, String(roleId));
          if (!success) {
            allSuccess = false;
            break;
          }
        }
        
        if (allSuccess) {
          setSuccess(true);
          setSearchTerm("");
          setSelectedUser(null);
          setSelectedRoleIds([]);
          setTimeout(() => {
            navigate("/workspace");
          }, 300);
        }
        setAdding(false);
      };
    
      const handleBack = () => {
        navigate("/workspace");
      };
    
      const handleUserSelect = (user: ITeamMember) => {
        setSelectedUser(user);
      };
    
      const currentTeamMembers = workspace?.team || [];

      return {
        handleBack,
        searchTerm,
        setSearchTerm,
        searching,
        searchResults,
        selectedUser,
        handleUserSelect,
        roles,
        selectedRoleIds,
        setSelectedRoleIds,
        adding,
        handleAddMember,
        success,
        currentTeamMembers,
        rolesLoading,
      };
}