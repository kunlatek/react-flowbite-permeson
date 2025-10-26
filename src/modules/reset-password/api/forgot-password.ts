import api from "@/services/api";

export const forgotPassword = async (email: string) => {
    const response = await api.post("/auth/reset-password-request", { email });
    return response.data;
};