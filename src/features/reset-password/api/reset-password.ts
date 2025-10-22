import api from "@/services/api";

export const resetPassword = async (token: string, password: string) => {
    const response = await api.post("/auth/reset-password", {
        token,
        password,
    });
    return response.data;
};