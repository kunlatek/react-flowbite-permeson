import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Button, Spinner } from "flowbite-react";
import { HiArrowLeft, HiCalendar, HiClock, HiUser, HiDocumentText } from "react-icons/hi";
import { postsService } from "@/services/postsService";
import { useToast } from "@/hooks/useToast";
import type { IPost } from "@/models/posts";

export default function PostViewPage() {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const toast = useToast();
    const [post, setPost] = useState<IPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPost = async () => {
            if (!id) {
                setError(t("posts.error.invalid_id"));
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const postData = await postsService.getPostById(id);
                setPost(postData);
            } catch (err: any) {
                const errorMessage = err.response?.data?.message || err.message || t("posts.error.not_found");
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id, t]);

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";

        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return "Data inválida";
            }

            return date.toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            });
        } catch (error) {
            return "Data inválida";
        }
    };

    const formatReadingTime = (minutes: number) => {
        return t("posts.reading_time", { minutes });
    };

    const handleBack = () => {
        navigate("/posts");
    };

    if (loading) {
        return (
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-4xl">
                    <div className="flex justify-center items-center h-64">
                        <Spinner size="lg" />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex-1 p-4 sm:p-6 lg:p-8">
                <div className="mx-auto max-w-4xl">
                    <Card>
                        <div className="text-center py-8">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                {t("posts.error.not_found")}
                            </h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">
                                {error || t("posts.error.post_not_available")}
                            </p>
                            <Button 
                                className="mb-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                                onClick={handleBack} color="gray">
                                    <HiArrowLeft className="mr-2 h-4 w-4" />
                                    {t("posts.back_to_list")}
                            </Button>
                        </div>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="mx-auto max-w-4xl">
                {/* Header com botão de voltar */}
                <div className="mb-6">
                    <Button className="mb-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600" onClick={handleBack} color="gray">
                        <HiArrowLeft className="mr-2 h-4 w-4" />
                        {t("posts.back_to_list")}
                    </Button>
                </div>

                <Card>
                    <div className="space-y-6">
                        {/* Header com título */}
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                {post.title}
                            </h1>
                            <div className="flex items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex items-center gap-2">
                                    <HiUser className="h-4 w-4" />
                                    <span>{post.author}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiClock className="h-4 w-4" />
                                    <span>{formatReadingTime(post.readingTime)}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <HiCalendar className="h-4 w-4" />
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Conteúdo do post */}
                        <div className="prose prose-lg max-w-none dark:prose-invert">
                            <div
                                className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                                dangerouslySetInnerHTML={{ __html: post.content }}
                            />
                        </div>

                        {/* Cover/Imagem se existir */}
                        {post.cover && post.cover.length > 0 && (
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    {t("posts.form.cover")}
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {post.cover.map((file, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={file.url}
                                                alt={`Cover ${index + 1}`}
                                                className="w-full h-48 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                                                onClick={() => window.open(file.url, '_blank')}
                                            />
                                            {file.name && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                                                    {file.name}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Informações adicionais */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t("posts.form.title")}
                                    </label>
                                    <p className="text-gray-900 dark:text-white mt-1">{post.title}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t("posts.form.author")}
                                    </label>
                                    <p className="text-gray-900 dark:text-white mt-1">{post.author}</p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t("posts.form.reading_time")}
                                    </label>
                                    <p className="text-gray-900 dark:text-white mt-1">
                                        {formatReadingTime(post.readingTime)}
                                    </p>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t("posts.created_at")}
                                    </label>
                                    <p className="text-gray-900 dark:text-white mt-1">
                                        {formatDate(post.createdAt)}
                                    </p>
                                </div>
                                {post.updatedAt && post.updatedAt !== post.createdAt && (
                                    <div>
                                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            {t("posts.updated_at")}
                                        </label>
                                        <p className="text-gray-900 dark:text-white mt-1">
                                            {formatDate(post.updatedAt)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
