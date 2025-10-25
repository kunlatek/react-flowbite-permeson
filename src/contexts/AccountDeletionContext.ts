import { createContext } from "react";
import type { IAccountDeletionContext } from "@/models/account-deletion";

export const AccountDeletionContext = createContext<
  IAccountDeletionContext | undefined
>(undefined);
