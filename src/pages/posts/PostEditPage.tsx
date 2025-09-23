import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Button, Spinner, Alert } from "flowbite-react";
import { HiArrowLeft } from "react-icons/hi";
import { KuInput, KuButton } from "@/components/form";
import { useToast } from "@/hooks/useToast";
import { postsService } from "@/services/postsService";
import { FileManager } from "@/components/common";
import type { IPost, IPostFormData } from "@/models/posts";
import type { IFileItem } from "@/components/common";

export default function PostEditPage() {
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
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>("");

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
      const postData = await postsService.getPostById(id);
      setPost(postData);
      
      const formattedDate = postData.publishedAt ? formatDateForInput(postData.publishedAt) : "";
      
      setFormData({
        title: postData.title,
        content: postData.content,
        publishedAt: formattedDate,
        readingTime: postData.readingTime,
        author: postData.author,
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

  const handleInputChange = (name: string, value: string | number) => {
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
      };

      await postsService.updatePost(post._id, updateData);
      
      // Upload files for all fields that have selected files
      const fields = Object.keys(selectedFiles);
      for (const field of fields) {
        const fieldFiles = selectedFiles[field] || [];
        const keepFiles = files[field] || [];
        try {
          const updateData = await postsService.uploadFiles(post._id, field, fieldFiles, keepFiles);
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

  if (loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="flex justify-center items-center h-64">
          <Spinner size="xl" />
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <Alert color="failure" className="mb-6">
            {error || t("posts.error.not_found")}
          </Alert>
          <Button
            className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
            onClick={() => navigate("/posts")}
          >
            <HiArrowLeft className="mr-2 h-4 w-4" />
            {t("posts.back_to_list")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            className="mb-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
            onClick={() => navigate(`/posts`)}
          >
            <HiArrowLeft className="mr-2 h-4 w-4" />
            {t("posts.back_to_list")}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("posts.edit_post")}
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {t("posts.edit_post_description")}
          </p>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <KuInput
              type="input"
              name="title"
              label={t("posts.form.title")}
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              dataType="text"
              placeholder={t("posts.form.title_placeholder")}
              isRequired={true}
              isDisabled={saving}
            />

            {/* Author */}
            <KuInput
              type="input"
              name="author"
              label={t("posts.form.author")}
              value={formData.author}
              onChange={(e) => handleInputChange("author", e.target.value)}
              dataType="text"
              placeholder={t("posts.form.author_placeholder")}
              isRequired={true}
              isDisabled={saving}
            />

            {/* Reading Time */}
            <KuInput
              type="input"
              name="readingTime"
              label={t("posts.form.reading_time")}
              value={formData.readingTime}
              onChange={(e) => handleInputChange("readingTime", Number(e.target.value))}
              dataType="number"
              placeholder="5"
              isRequired={true}
              isDisabled={saving}
            />

            {/* Published At */}
            <KuInput
              type="input"
              name="publishedAt"
              label={t("posts.form.published_at")}
              value={formData.publishedAt}
              onChange={(e) => handleInputChange("publishedAt", e.target.value)}
              dataType="date"
              isDisabled={saving}
              tooltip={t("posts.form.published_at_tooltip")}
            />

            {/* Content */}
            <div className="space-y-2">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-900 dark:text-white"
              >
                {t("posts.form.content")}
                <span className="text-red-500 ml-1">*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={12}
                value={formData.content}
                onChange={(e) => handleInputChange("content", e.target.value)}
                placeholder={t("posts.form.content_placeholder")}
                required
                disabled={saving}
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
              />
            </div>

            {/* Cover Images */}
            <FileManager
              files={files.cover}
              onFilesChange={(files) => handleFilesChange("cover", files)}
              onFilesSelect={(files) => handleFilesSelect("cover", files)}
              isUploading={saving}
              disabled={saving}
              label="Imagens de Capa"
              accept="image/*"
            />

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <KuButton
                id="update-post"
                type="button"
                actionType="submit"
                isDisabled={saving}
                label={saving ? t("posts.updating") : "Salvar"}
                customClass="flex items-center justify-center"
              >
                {saving && <Spinner size="sm" className="mr-2" />}
              </KuButton>
              <Button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                onClick={() => navigate("/posts")}
                disabled={saving}
              >
                {t("posts.cancel")}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}
