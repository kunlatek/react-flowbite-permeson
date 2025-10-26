import api from "@/services/api";

export const deletePost = async (id: string): Promise<void> => {
    try {
        await api.delete(`/posts/${id}`);
    } catch (error) {
        throw error;
    }
};