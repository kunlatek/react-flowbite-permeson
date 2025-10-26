import api from "@/services/api";

export const preRegister = async (email: string) => {
    try {
        const response = await api.post("/auth/presignup", { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};