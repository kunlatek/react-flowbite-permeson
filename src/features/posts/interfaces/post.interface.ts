import type { IFileItem } from "@/components/common";

export interface ICoauthor {
    name: string;
    subject: string;
    link: string;
    phone: string;
}

export interface IPost {
    _id: string;
    title: string;
    content: string;
    publishedAt?: string;
    readingTime: number; // in minutes
    author: string;
    createdBy: string;
    cover?: IFileItem[];
    tags?: string[];
    coauthors?: ICoauthor[];
    relatedPosts?: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ICreatePost {
    title: string;
    content: string;
    publishedAt?: string;
    readingTime: number;
    author: string;
    tags?: string[];
    coauthors?: ICoauthor[];
    relatedPosts?: string[];
}

export interface IUpdatePost {
    title?: string;
    content?: string;
    publishedAt?: string;
    readingTime?: number;
    author?: string;
    tags?: string[];
    coauthors?: ICoauthor[];
    relatedPosts?: string[];
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
    tags: string[];
    coauthors: ICoauthor[];
    relatedPosts: string[];
}
