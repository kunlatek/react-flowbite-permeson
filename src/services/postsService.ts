import api from "./api";
import type { IPost, ICreatePost, IUpdatePost, IPostsResponse } from "@/models/posts";

export const postsService = {
  // Get all posts with pagination
  getPosts: async (page: number = 1, limit: number = 10): Promise<IPostsResponse> => {
    try {
      const response = await api.get("/posts", {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get single post by ID
  getPostById: async (id: string): Promise<IPost> => {
    try {
      const response = await api.get(`/posts/${id}`);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Create new post
  createPost: async (postData: ICreatePost): Promise<IPost> => {
    try {
      const response = await api.post("/posts", postData);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update post
  updatePost: async (id: string, postData: IUpdatePost): Promise<IPost> => {
    try {
      const response = await api.put(`/posts/${id}`, postData);
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Delete post
  deletePost: async (id: string): Promise<void> => {
    try {
      await api.delete(`/posts/${id}`);
    } catch (error) {
      throw error;
    }
  }
};

export default postsService;
