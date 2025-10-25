import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { IColumn, IAction, IHeaderAction } from "@/components/data/ku-data-table";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { useTranslation } from "react-i18next";

import { useWorkspace } from "@/features/workspace/hooks/use-workspace";
import type { IFileItem } from "@/components/common";

import type { IPost, IPostsResponse, IPostFormData, ICoauthor } from "../interfaces/post.interface";

import { fetchPosts } from "../api/fetch-posts";
import { fetchPostById } from "../api/fetch-posts";
import { createPost } from "../api/create-post";
import { updatePost } from "../api/update-post";
import { deletePost } from "../api/delete-post";
import { uploadFiles } from "../api/upload-files";

export const usePostLists = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();
    const { workspace } = useWorkspace();
    const { permissions } = useUserPermissions();
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [postToDelete, setPostToDelete] = useState<IPost | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const handleView = (post: IPost) => {
        navigate(`/posts/${post._id}`);
    };

    const canEditPost = (post: IPost) => {
        if (!workspace?.currentUserId) return false;

        const isOwner = workspace.isOwner;
        const isCreator = String(post.createdBy) === String(workspace.currentUserId);

        return isOwner || isCreator;
    };

    const handleDeleteClick = (post: IPost) => {
        setPostToDelete(post);
        setDeleteModalOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!postToDelete) return;

        setDeleteLoading(true);
        try {
            await deletePost(postToDelete._id);
            toast.success(t("posts.delete_success"));
            setDeleteModalOpen(false);
            setPostToDelete(null);
        } catch (err: any) {
            toast.error(err.message || t("posts.error.delete_failed"));
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModalOpen(false);
        setPostToDelete(null);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                console.warn("Invalid date string:", dateString);
                return "Data inválida";
            }

            return date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch (error) {
            console.error("Error formatting date:", error, dateString);
            return "Data inválida";
        }
    };

    const formatReadingTime = (minutes: number) => {
        return t("posts.reading_time", { minutes });
    };

    // Função para buscar dados compatível com KuDataTable
    const getPosts = async (params: URLSearchParams) => {
        const page = Number(params.get("page")) || 1;
        const limit = Number(params.get("limit")) || 10;

        const response: IPostsResponse = await fetchPosts(page, limit);

        return {
            data: response.data || [],
            total: response.total || 0,
        };
    };

    // Definição das colunas da tabela
    const columns: IColumn<IPost>[] = [
        {
            key: "title",
            header: t("posts.form.title"),
            sortable: true,
        },
        {
            key: "author",
            header: t("posts.form.author"),
            sortable: true,
        },
        {
            key: "readingTime",
            header: t("posts.form.reading_time"),
            sortable: true,
            formatValue: (value) => formatReadingTime(Number(value)),
        },
        {
            key: "createdAt",
            header: t("posts.created_at"),
            sortable: true,
            formatValue: (value) => formatDate(value as string),
        },
    ];

    // Definição das ações da tabela
    const getActions = (post: IPost): IAction<IPost>[] => {
        const baseActions: IAction<IPost>[] = [
            {
                label: t("posts.view"),
                color: "secondary",
                handler: handleView,
            },
        ];

        // Adicionar ações de editar e deletar apenas se o usuário tiver permissão
        if (canEditPost(post)) {
            if (permissions.canEditPosts) {
                baseActions.push({
                    label: t("posts.edit"),
                    color: "primary",
                    handler: (post) => navigate(`/posts/${post._id}/edit`),
                });
            }

            if (permissions.canDeletePosts) {
                baseActions.push({
                    label: t("posts.delete"),
                    color: "danger",
                    handler: handleDeleteClick,
                });
            }
        }

        return baseActions;
    };

    // Ações do header
    const headerActions: IHeaderAction[] = [];

    if (permissions.canCreatePosts) {
        headerActions.push({
            label: t("posts.new_post"),
            color: "primary",
            handler: () => navigate("/posts/new"),
        });
    }

    return {
        columns,
        getActions,
        headerActions,
        fetchPosts: getPosts,
        deleteModalOpen,
        postToDelete,
        deleteLoading,
        handleDeleteConfirm,
        handleDeleteCancel,
    };
};

export const usePostCreate = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();

    const [formData, setFormData] = useState<IPostFormData>({
        title: "",
        content: "",
        publishedAt: "",
        readingTime: 1,
        author: "",
        tags: [],
        coauthors: [],
        relatedPosts: [],
    });
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState(0);

    const [files, setFiles] = useState<{ [key: string]: IFileItem[] }>({
        cover: []
    });
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File[] }>({
        cover: []
    });

    const handleInputChange = (name: string, value: string | number | string[] | ICoauthor[]) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRelatedPostsChange = (name: string, value: string[]) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilesChange = (field: string, files: IFileItem[]) => {
        setFiles(prev => ({ ...prev, [field]: files }));
    };

    const handleFilesSelect = (field: string, files: File[]) => {
        setSelectedFiles(prev => ({ ...prev, [field]: files }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
            toast.error(t("posts.error.required_fields"));
            return;
        }

        try {
            setLoading(true);

            const postData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                author: formData.author.trim(),
                readingTime: Number(formData.readingTime),
                publishedAt: formData.publishedAt ? formData.publishedAt : undefined,
                tags: formData.tags.length > 0 ? formData.tags : undefined,
                coauthors: formData.coauthors.length > 0 ? formData.coauthors : undefined,
                relatedPosts: formData.relatedPosts.length > 0 ? formData.relatedPosts : undefined,
            };

            const createdPost = await createPost(postData);

            // Upload cover files if any were selected
            const fields = Object.keys(selectedFiles);
            for (const field of fields) {
                const fieldFiles = selectedFiles[field] || [];
                const keepFiles = files[field] || [];
                if (fieldFiles.length > 0) {
                    try {
                        const updateData = await uploadFiles(createdPost._id, field, fieldFiles, keepFiles);
                        setFiles(prev => ({ ...prev, [field]: (updateData as any)[field] || [] }));
                    } catch (uploadError: any) {
                        // If upload fails, delete the created post
                        try {
                            await deletePost(createdPost._id);
                        } catch (deleteError) {
                            console.error("Failed to delete post after upload failure:", deleteError);
                        }
                        throw uploadError;
                    }
                }
            }

            toast.success(t("posts.create_success"));
            navigate("/posts");
        } catch (err: any) {
            toast.error(err.message || t("posts.error.create_failed"));
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        loading,
        activeTab,
        setActiveTab,
        files,
        setFiles,
        selectedFiles,
        setSelectedFiles,
        handleInputChange,
        handleRelatedPostsChange,
        handleFilesChange,
        handleFilesSelect,
        handleSubmit,
    };
}

export const usePostEdit = () => {
    const { id } = useParams<{ id: string }>();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const toast = useToast();

    const [post, setPost] = useState<IPost | null>(null);
    const [formData, setFormData] = useState<IPostFormData>({
        title: "",
        content: "",
        publishedAt: "",
        readingTime: 1,
        author: "",
        tags: [],
        coauthors: [],
        relatedPosts: [],
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string>("");
    const [activeTab, setActiveTab] = useState(0);

    const [files, setFiles] = useState<{ [key: string]: IFileItem[] }>({
        cover: []
    });
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File[] }>({
        cover: []
    });

    const fetchPost = async () => {
        if (!id) {
            setError(t("posts.error.invalid_id"));
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");
            const postData = await fetchPostById(id);
            setPost(postData);

            const formattedDate = postData.publishedAt ? formatDateForInput(postData.publishedAt) : "";

            setFormData({
                title: postData.title,
                content: postData.content,
                publishedAt: formattedDate,
                readingTime: postData.readingTime,
                author: postData.author,
                tags: postData.tags || [],
                coauthors: postData.coauthors || [],
                relatedPosts: postData.relatedPosts || [],
            });

            const fileFields = Object.keys(postData);
            const newFiles: { [key: string]: IFileItem[] } = {};
            fileFields.forEach(field => {
                newFiles[field] = (postData as any)[field] || [];
            });
            setFiles(newFiles);

        } catch (err: any) {
            setError(err.message || t("posts.error.fetch_failed"));
            toast.error(t("posts.error.fetch_failed"));
        } finally {
            setLoading(false);
        }
    };

    const formatDateForInput = (dateString: string) => {
        if (!dateString) return "";

        try {
            const date = new Date(dateString);

            if (isNaN(date.getTime())) {
                console.warn("Invalid date for input:", dateString);
                return "";
            }

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');

            const formatted = `${year}-${month}-${day}`;

            return formatted;
        } catch (error) {
            console.error("Error formatting date for input:", error, dateString);
            return "";
        }
    };

    const handleInputChange = (name: string, value: string | number | string[] | ICoauthor[]) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleRelatedPostsChange = (name: string, value: string[]) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFilesChange = (field: string, files: IFileItem[]) => {
        setFiles(prev => ({ ...prev, [field]: files }));
    };

    const handleFilesSelect = (field: string, files: File[]) => {
        setSelectedFiles(prev => ({ ...prev, [field]: files }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.title.trim() || !formData.content.trim() || !formData.author.trim()) {
            toast.error(t("posts.error.required_fields"));
            return;
        }

        if (!post) return;

        try {
            setSaving(true);

            const updateData = {
                title: formData.title.trim(),
                content: formData.content.trim(),
                author: formData.author.trim(),
                readingTime: Number(formData.readingTime),
                publishedAt: formData.publishedAt ? formData.publishedAt : undefined,
                tags: formData.tags.length > 0 ? formData.tags : undefined,
                coauthors: formData.coauthors.length > 0 ? formData.coauthors : undefined,
                relatedPosts: formData.relatedPosts.length > 0 ? formData.relatedPosts : undefined,
            };

            await updatePost(post._id, updateData);

            // Upload files for all fields that have selected files
            const fields = Object.keys(selectedFiles);
            for (const field of fields) {
                const fieldFiles = selectedFiles[field] || [];
                const keepFiles = files[field] || [];
                try {
                    const updateData = await uploadFiles(post._id, field, fieldFiles, keepFiles);
                    setFiles(prev => ({ ...prev, [field]: (updateData as any)[field] || [] }));
                } catch (uploadError: any) {
                    toast.error(uploadError.message || "Failed to upload files");
                    return; // Don't navigate if upload fails
                }
            }

            toast.success(t("posts.update_success"));
            navigate("/posts");
        } catch (err: any) {
            toast.error(err.message || t("posts.error.update_failed"));
        } finally {
            setSaving(false);
        }
    };


    useEffect(() => {
        fetchPost();
    }, [id]);

    return {
        post,
        formData,
        loading,
        saving,
        error,
        activeTab,
        setActiveTab,
        files,
        setFiles,
        selectedFiles,
        setSelectedFiles,
        handleInputChange,
        handleRelatedPostsChange,
        handleFilesChange,
        handleFilesSelect,
        handleSubmit,
        fetchPost,
        formatDateForInput,
    };
};