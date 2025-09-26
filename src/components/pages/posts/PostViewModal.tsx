import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Badge } from "flowbite-react";
import { HiCalendar, HiClock, HiUser, HiDocumentText } from "react-icons/hi";
import type { IPost } from "@/models/posts";

interface PostViewModalProps {
    show: boolean;
    onClose: () => void;
    post: IPost | null;
}

export default function PostViewModal({ show, onClose, post }: PostViewModalProps) {
    const { t } = useTranslation();

    if (!post) return null;

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

    return (
        <Modal show={show} onClose={onClose} onClick={onClose} size="4xl" className="backdrop-blur-sm pt-10">
            <Modal.Body>
                <div className="space-y-6">
                    {/* Header com título e status */}
                    <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <div className="flex items-start justify-between gap-4">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {t("posts.details")}
                            </h2>
                        </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t("posts.form.title")}
                                </label>
                                <p className="text-gray-900 dark:text-white">{post.title}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t("posts.form.author")}
                                </label>
                                <p className="text-gray-900 dark:text-white">{post.author}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t("posts.form.reading_time")}
                                </label>
                                <p className="text-gray-900 dark:text-white">
                                    {formatReadingTime(post.readingTime)}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    {t("posts.form.content")}
                                </label>
                                <div className="prose prose-sm max-w-none dark:prose-invert">
                                    <div
                                        className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap"
                                        dangerouslySetInnerHTML={{ __html: post.content }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Cover/Imagem se existir */}
                        {post.cover && post.cover.length > 0 && (
                            <div className="gap-3 mb-4">
                                <div className="mb-2">
                                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        {t("posts.form.cover")}
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {post.cover.map((file, index) => (
                                        <div key={index} className="relative">
                                            <img
                                                src={file.url}
                                                alt={`Cover ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            {file.name && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                    {file.name}
                                                </p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </Modal.Body>
        </Modal>
    );
}
