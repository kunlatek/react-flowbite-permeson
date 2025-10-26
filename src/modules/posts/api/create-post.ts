import api from "@/services/api";
import { ICreatePost, IPost } from "../interfaces/post.interface";

export const createPost = async (postData: ICreatePost): Promise<IPost> => {
    try {
        const response = await api.post("/posts", postData);
        if (response.data && response.data.data) {
            return response.data.data;
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};