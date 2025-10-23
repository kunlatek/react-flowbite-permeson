import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITeamMember } from "../interfaces";

import { useUserSearch } from "./use-user-search";
import { useWorkspace } from "./use-workspace";

import { useRoles } from "@/hooks/useRoles";

export const useAddMember = () => {
    const navigate = useNavigate();
      const [searchTerm, setSearchTerm] = useState("");
      const [selectedUser, setSelectedUser] = useState<ITeamMember | null>(null);
      const [selectedRoleId, setSelectedRoleId] = useState<string>("");
      const [adding, setAdding] = useState(false);
      const [success, setSuccess] = useState(false);
      
      const { searchResults, searching, searchUsers } = useUserSearch();
      const { workspace, addMember } = useWorkspace();
      const { roles, loading: rolesLoading } = useRoles();
    
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
        const success = await addMember(selectedUser.userId, selectedRoleId || undefined);
        if (success) {
          setSuccess(true);
          // Reset form
          setSearchTerm("");
          setSelectedUser(null);
          setSelectedRoleId("");
          // Auto redirect after 2 seconds
          setTimeout(() => {
            navigate("/workspace");
          }, 2000);
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
        selectedRoleId,
        setSelectedRoleId,
        adding,
        handleAddMember,
        success,
        currentTeamMembers,
        rolesLoading,
      };
}