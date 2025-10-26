import api from "@/services/api";

import { IPost, IPostsResponse } from "../interfaces/post.interface";

export const fetchPosts = async (page: number = 1, limit: number = 10): Promise<IPostsResponse> => {
    try {
        const response = await api.get("/posts", {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchPostById = async (id: string): Promise<IPost> => {
    try {
        const response = await api.get(`/posts/${id}`);

        if (response.data && response.data.data) {
            return response.data.data;
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};