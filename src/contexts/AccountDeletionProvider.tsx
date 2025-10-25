import { useState, useCallback, type ReactNode } from "react";
import axios from "axios";
import { AccountDeletionContext } from "./AccountDeletionContext";
import { userService } from "@/services/user-service";
import type { IAccountDeletionState } from "@/models/account-deletion";

export const AccountDeletionProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [state, setState] = useState<IAccountDeletionState>({
    isDeleted: false,
    deletedAt: null,
    daysRemaining: 0,
    loading: false,
    error: null,
  });

  const fetchDeletionStatus = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const userDetails = await userService.getCurrentUserDetails();
      if (userDetails && userDetails.deletedAt) {
        const daysRemaining = userService.calculateDaysRemaining(
          userDetails.deletedAt
        );
        setState((s) => ({
          ...s,
          isDeleted: true,
          deletedAt: userDetails.deletedAt!,
          daysRemaining,
          loading: false,
        }));
      } else {
        setState((s) => ({
          ...s,
          isDeleted: false,
          deletedAt: null,
          daysRemaining: 0,
          loading: false,
        }));
      }
    } catch (error) {
      console.error("Error fetching deletion status:", error);
      setState((s) => ({
        ...s,
        loading: false,
        error: "Failed to fetch deletion status",
      }));
    }
  }, []);

  const softDeleteAccount = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await userService.softDeleteOwnProfile();
      const now = new Date().toISOString();
      const daysRemaining = userService.calculateDaysRemaining(now);
      setState((s) => ({
        ...s,
        isDeleted: true,
        deletedAt: now,
        daysRemaining,
        loading: false,
      }));
    } catch (error: unknown) {
      let message = "Failed to delete account";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      setState((s) => ({ ...s, loading: false, error: message }));
      throw error;
    }
  }, []);

  const restoreAccount = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      await userService.restoreUser();
      setState({
        isDeleted: false,
        deletedAt: null,
        daysRemaining: 0,
        loading: false,
        error: null,
      });
    } catch (error: unknown) {
      let message = "Failed to restore account";
      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || message;
      }
      setState((s) => ({ ...s, loading: false, error: message }));
      throw error;
    }
  }, []);

  const value = {
    ...state,
    fetchDeletionStatus,
    softDeleteAccount,
    restoreAccount,
  };

  return (
    <AccountDeletionContext.Provider value={value}>
      {children}
    </AccountDeletionContext.Provider>
  );
};
