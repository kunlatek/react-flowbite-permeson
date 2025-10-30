import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ITeamMember } from "../interfaces";

import { useUserSearch } from "./use-user-search";
import { useWorkspace } from "./use-workspace";

export const useAddMember = () => {
    const navigate = useNavigate();
      const [searchTerm, setSearchTerm] = useState("");
      const [selectedUser, setSelectedUser] = useState<ITeamMember | null>(null);
      const [adding, setAdding] = useState(false);
      const [success, setSuccess] = useState(false);
      
      const { searchResults, searching, searchUsers } = useUserSearch();
      const { workspace, addMember } = useWorkspace();
        
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
        const success = await addMember(selectedUser.userId);
        if (success) {
          setSuccess(true);
          // Reset form
          setSearchTerm("");
          setSelectedUser(null);
          // Auto redirect after 2 seconds
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
        adding,
        handleAddMember,
        success,
        currentTeamMembers,
      };
}