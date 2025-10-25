import api from "@/services/api";
import { IPost } from "../interfaces/post.interface";
import { IFileItem } from "@/components/common/FileManager";

export const uploadFiles = async (id: string, field: string, files: File[], keepFiles: IFileItem[] = []): Promise<IPost> => {
    try {
        const formData = new FormData();

        files.forEach((file) => {
            formData.append('files', file);
        });

        if (keepFiles.length > 0) {
            formData.append('keepFiles', JSON.stringify(keepFiles));
        }

        const response = await api.post(`/posts/${id}/upload/${field}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data && response.data.data) {
            return response.data.data;
        }

        return response.data;
    } catch (error) {
        throw error;
    }
};