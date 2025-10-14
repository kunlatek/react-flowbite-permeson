import api from "./api";

const login = async (email: string, password: string) => {
  const response = await api.post("/auth/login", { email, password });
  return response.data;
};

const logout = () => {};


const forgotPassword = async (email: string) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

const resetPassword = async (token: string, password: string) => {
  const response = await api.post("/auth/reset-password", { token, password });
  return response.data;
};

const switchRole = async (role: string) => {
  const response = await api.post("/auth/switch-role", { role });
  return response.data;
};

export const authService = {
  login,
  logout,
  forgotPassword,
  resetPassword,
  switchRole,
};
