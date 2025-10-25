export interface IAccountDeletionState {
  isDeleted: boolean;
  deletedAt: string | null;
  daysRemaining: number;
  loading: boolean;
  error: string | null;
}

export interface IAccountDeletionContext extends IAccountDeletionState {
  fetchDeletionStatus: () => Promise<void>;
  softDeleteAccount: () => Promise<void>;
  restoreAccount: () => Promise<void>;
}
