import { useContext } from "react";
import { AccountDeletionContext } from "@/contexts/AccountDeletionContext";

export const useAccountDeletion = () => {
  const context = useContext(AccountDeletionContext);
  if (context === undefined) {
    throw new Error(
      "useAccountDeletion must be used within an AccountDeletionProvider"
    );
  }
  return context;
};
