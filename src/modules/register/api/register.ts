import api from "@/services/api";

export const register = async (email: string, password: string, token: string) => {
    try {
        const response = await api.post("/auth/signup", { email, password, token });
        return response.data;
    } catch (error) {
        throw error;
    }
};