import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Button, Spinner, Tabs } from "flowbite-react";
import { HiArrowLeft } from "react-icons/hi";
import { KuInput, KuButton, KuArrayForm, KUMultipleAutocomplete } from "@/components/form";
import { useToast } from "@/hooks/useToast";
import { postsService } from "@/services/postsService";
import { FileManager } from "@/components/common";
import type { IPostFormData, ICoauthor } from "@/models/posts";
import type { IFileItem } from "@/components/common";

export default function PostCreatePage() {
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

      const createdPost = await postsService.createPost(postData);

      // Upload cover files if any were selected
      const fields = Object.keys(selectedFiles);
      for (const field of fields) {
        const fieldFiles = selectedFiles[field] || [];
        const keepFiles = files[field] || [];
        if (fieldFiles.length > 0) {
          try {
             const updateData = await postsService.uploadFiles(createdPost._id, field, fieldFiles, keepFiles);
             setFiles(prev => ({ ...prev, [field]: (updateData as any)[field] || [] }));
          } catch (uploadError: any) {
            // If upload fails, delete the created post
            try {
              await postsService.deletePost(createdPost._id);
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


  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <Button
            className="mb-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
            onClick={() => navigate("/posts")}
          >
            <HiArrowLeft className="mr-2 h-4 w-4" />
            {t("posts.back_to_list")}
          </Button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t("posts.new_post")}
          </h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            {t("posts.new_post_description")}
          </p>
        </div>

        {/* Form */}
        <Card>
          <form onSubmit={handleSubmit}>
            {/* Tabs for all information */}
            <Tabs 
              aria-label="Post information tabs" 
              onActiveTabChange={(tab: number) => setActiveTab(tab)}
            >
              <Tabs.Item 
                active={activeTab === 0} 
                title="Geral"
              >
                <div className="p-6 space-y-6">
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
                    isDisabled={loading}
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
                    isDisabled={loading}
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
                    isDisabled={loading}
                  />

                  {/* Published At */}
                  <KuInput
                    type="input"
                    name="publishedAt"
                    label={t("posts.form.published_at")}
                    value={formData.publishedAt}
                    onChange={(e) => handleInputChange("publishedAt", e.target.value)}
                    dataType="date"
                    isDisabled={loading}
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
                      disabled={loading}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                    />
                  </div>

                  {/* Related Posts */}
                  <KUMultipleAutocomplete
                    name="relatedPosts"
                    label="Posts Relacionados"
                    value={formData.relatedPosts}
                    onChange={handleRelatedPostsChange}
                    apiConfig={{
                      endpoint: "/posts",
                      searchParam: "title",
                      labelField: "title",
                      valueField: "_id",
                      limit: 20,
                    }}
                    placeholder="Pesquisar posts relacionados"
                    isDisabled={loading}
                    tooltip="Adicione posts relacionados a este post"
                    excludeIds={[]}
                    loadSelectedItems={true}
                  />
                </div>
              </Tabs.Item>

              <Tabs.Item 
                active={activeTab === 1} 
                title="Tags"
              >
                <div className="p-6">
                  <KuArrayForm
                    name="tags"
                    label="Tags"
                    value={formData.tags}
                    onChange={(name, value) => handleInputChange(name, value)}
                    itemType="string"
                    placeholder="Digite uma tag"
                    isDisabled={loading}
                    tooltip="Adicione tags para categorizar o post"
                  />
                </div>
              </Tabs.Item>

              <Tabs.Item 
                active={activeTab === 2}
                title="Coautores"
              >
                <div className="p-6">
                  <KuArrayForm
                    name="coauthors"
                    label="Coautores"
                    value={formData.coauthors}
                    onChange={(name, value) => handleInputChange(name, value)}
                    itemType="object"
                    fields={[
                      { name: "name", label: "Nome", type: "text", required: true },
                      { name: "subject", label: "Assunto", type: "text", required: true },
                      { name: "link", label: "Link", type: "url", required: false },
                      { name: "phone", label: "Telefone", type: "tel", required: false }
                    ]}
                    isDisabled={loading}
                    tooltip="Adicione coautores do post"
                  />
                </div>
              </Tabs.Item>

              <Tabs.Item 
                active={activeTab === 3}
                title="Imagem de Capa"
              >
                <div className="p-6">
                  <FileManager
                    files={files.cover}
                    onFilesChange={(files) => handleFilesChange("cover", files)}
                    onFilesSelect={(files) => handleFilesSelect("cover", files)}
                    isUploading={loading}
                    disabled={loading}
                    label="Imagens de Capa"
                    accept="image/*"
                  />
                </div>
              </Tabs.Item>
            </Tabs>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <KuButton
                id="create-post"
                type="button"
                actionType="submit"
                isDisabled={loading}
                label={loading ? t("posts.creating") : "Salvar"}
                customClass="flex items-center justify-center"
              >
                {loading && <Spinner size="sm" className="mr-2" />}
              </KuButton>
              <Button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                onClick={() => navigate("/posts")}
                disabled={loading}
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
