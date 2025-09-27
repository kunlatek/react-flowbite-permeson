import type { IFileItem } from "@/components/common";

export interface IPost {
  _id: string;
  title: string;
  content: string;
  publishedAt?: string;
  readingTime: number; // in minutes
  author: string;
  createdBy: string;
  cover?: IFileItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ICreatePost {
  title: string;
  content: string;
  publishedAt?: string;
  readingTime: number;
  author: string;
}

export interface IUpdatePost {
  title?: string;
  content?: string;
  publishedAt?: string;
  readingTime?: number;
  author?: string;
}

export interface IPostsResponse {
  data: IPost[];
  limit: number;
  message: string;
  page: number;
  statusCode: number;
  total: number;
}

export interface IPostFormData {
  title: string;
  content: string;
  publishedAt: string;
  readingTime: number;
  author: string;
}
