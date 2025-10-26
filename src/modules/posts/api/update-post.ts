import api from "@/services/api";
import { IUpdatePost, IPost } from "../interfaces/post.interface";

export const updatePost = async (id: string, postData: IUpdatePost): Promise<IPost> => {
    try {
        const response = await api.put(`/posts/${id}`, postData);
        if (response.data && response.data.data) {
            return response.data.data;
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};