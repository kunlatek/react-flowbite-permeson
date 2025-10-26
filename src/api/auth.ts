import api from "@/services/api";

export const logout = () => {};


export const switchRole = async (role: string) => {
    const response = await api.post("/auth/switch-role", { role });
    return response.data;
};