import { useCallback, useState } from "react";
import { useToast } from "../../../hooks/use-toast";
import { fetchUsers } from "../api/fetch-users";

import type { ITeamMember } from "../interfaces";

export const useUserSearch = () => {
  const [searchResults, setSearchResults] = useState<ITeamMember[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const toast = useToast();

  const searchUsers = useCallback(async (username: string) => {
    if (!username || username.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setSearching(true);
      setSearchError(null);
      const results = await fetchUsers(username);

      // Remove duplicados baseado no userId
      const uniqueResults = results.filter((user, index, self) =>
        index === self.findIndex(u => u.userId === user.userId)
      );

      setSearchResults(uniqueResults);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao pesquisar usuários";
      setSearchError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSearching(false);
    }
  }, [toast]);

  return {
    searchResults,
    searching,
    searchError,
    searchUsers,
  };
};