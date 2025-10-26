import api from "@/services/api";

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};