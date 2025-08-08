import { createContext } from "react";
import type { IAccountDeletionContext } from "@/models/accountDeletion";

export const AccountDeletionContext = createContext<
  IAccountDeletionContext | undefined
>(undefined);
