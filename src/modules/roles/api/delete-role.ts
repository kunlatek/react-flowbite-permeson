import api from "@/services/api";

export const deleteRole = async (id: string): Promise<void> => {
    try {
        await api.delete(`/roles/${id}`);
    } catch (error) {
        throw error;
    }
};