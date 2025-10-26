import api from "./api";

interface UserDetails {
  deletedAt?: string;
}

const registerWithToken = async (
  email: string,
  password: string,
  token: string
) => {
  const response = await api.post("/auth/signup", {
    email,
    password,
    registerToken: token,
  });
  return response.data;
};

const getCurrentUserDetails = async (): Promise<UserDetails> => {
  const response = await api.get("/users/me");
  return response.data;
};

const changePassword = async (oldPassword: string, newPassword: string) => {
  const response = await api.patch("/users/change-password", {
    oldPassword,
    newPassword,
  });
  return response.data;
};

const softDeleteOwnProfile = async () => {
  const response = await api.delete("/auth/account");
  return response.data;
};

const restoreUser = async () => {
  const response = await api.patch("/users/restore");
  return response.data;
};

const calculateDaysRemaining = (deletedAt: string | null): number => {
  if (!deletedAt) return 0;

  const deletionDate = new Date(deletedAt);
  const permanentDeletionDate = new Date(deletionDate);
  permanentDeletionDate.setDate(permanentDeletionDate.getDate() + 90);

  const today = new Date();
  const timeDiff = permanentDeletionDate.getTime() - today.getTime();
  const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));

  return Math.max(0, daysRemaining);
};

export const userService = {
  registerWithToken,
  getCurrentUserDetails,
  changePassword,
  softDeleteOwnProfile,
  restoreUser,
  calculateDaysRemaining,
};
