import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Card, Button, Spinner, Alert, Tabs } from "flowbite-react";
import { HiArrowLeft } from "react-icons/hi";
import { KuInput, KuButton, KuArrayForm, KUMultipleAutocomplete } from "@/components/form";
import { FileManager } from "@/components/common";
import { usePostEdit } from "../hooks/use-posts";

export default function PostEditPage() {

  const postEdit = usePostEdit();
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (postEdit.loading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8" >
        <div className="flex justify-center items-center h-64" >
          <Spinner size="xl" />
        </div>
      </div>
    );
  }

  if (postEdit.error || !postEdit.post) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-4xl">
          <Alert color="failure" className="mb-6">
            {postEdit.error || t("posts.error.not_found") || t("posts.error.not_found")}
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
          <form onSubmit={postEdit.handleSubmit}>
            {/* Tabs for all information */}
            <Tabs
              aria-label="Post information tabs"
              onActiveTabChange={(tab: number) => postEdit.setActiveTab(tab)}
            >
              <Tabs.Item
                active={postEdit.activeTab === 0}
                title="Geral"
              >
                <div className="p-6 space-y-6">
                  {/* Title */}
                  <KuInput
                    type="input"
                    name="title"
                    label={t("posts.form.title")}
                    value={postEdit.formData.title}
                    onChange={(e) => postEdit.handleInputChange("title", e.target.value)}
                    dataType="text"
                    placeholder={t("posts.form.title_placeholder")}
                    isRequired={true}
                    isDisabled={postEdit.saving}
                  />

                  {/* Author */}
                  <KuInput
                    type="input"
                    name="author"
                    label={t("posts.form.author")}
                    value={postEdit.formData.author}
                    onChange={(e) => postEdit.handleInputChange("author", e.target.value)}
                    dataType="text"
                    placeholder={t("posts.form.author_placeholder")}
                    isRequired={true}
                    isDisabled={postEdit.saving}
                  />

                  {/* Reading Time */}
                  <KuInput
                    type="input"
                    name="readingTime"
                    label={t("posts.form.reading_time")}
                    value={postEdit.formData.readingTime}
                    onChange={(e) => postEdit.handleInputChange("readingTime", Number(e.target.value))}
                    dataType="number"
                    placeholder="5"
                    isRequired={true}
                    isDisabled={postEdit.saving}
                  />

                  {/* Published At */}
                  <KuInput
                    type="input"
                    name="publishedAt"
                    label={t("posts.form.published_at")}
                    value={postEdit.formData.publishedAt}
                    onChange={(e) => postEdit.handleInputChange("publishedAt", e.target.value)}
                    dataType="date"
                    isDisabled={postEdit.saving}
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
                      value={postEdit.formData.content}
                      onChange={(e) => postEdit.handleInputChange("content", e.target.value)}
                      placeholder={t("posts.form.content_placeholder")}
                      required
                      disabled={postEdit.saving}
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                    />
                  </div>

                  {/* Related Posts */}
                  <KUMultipleAutocomplete
                    name="relatedPosts"
                    label="Posts Relacionados"
                    value={postEdit.formData.relatedPosts}
                    onChange={postEdit.handleRelatedPostsChange}
                    apiConfig={{
                      endpoint: "/posts",
                      searchParam: "title",
                      labelField: "title",
                      valueField: "_id",
                      limit: 20,
                    }}
                    placeholder="Pesquisar posts relacionados"
                    isDisabled={postEdit.saving}
                    tooltip="Adicione posts relacionados a este post"
                    excludeIds={postEdit.post?._id ? [postEdit.post._id] : []}
                    loadSelectedItems={true}
                  />
                </div>
              </Tabs.Item>

              <Tabs.Item
                active={postEdit.activeTab === 1}
                title="Tags"
              >
                <div className="p-6">
                  <KuArrayForm
                    name="tags"
                    label="Tags"
                    value={postEdit.formData.tags}
                    onChange={(name, value) => postEdit.handleInputChange(name, value)}
                    itemType="string"
                    placeholder="Digite uma tag"
                    isDisabled={postEdit.saving}
                    tooltip="Adicione tags para categorizar o post"
                  />
                </div>
              </Tabs.Item>

              <Tabs.Item
                active={postEdit.activeTab === 2}
                title="Coautores"
              >
                <div className="p-6">
                  <KuArrayForm
                    name="coauthors"
                    label="Coautores"
                    value={postEdit.formData.coauthors}
                    onChange={(name, value) => postEdit.handleInputChange(name, value)}
                    itemType="object"
                    fields={[
                      { name: "name", label: "Nome", type: "text", required: true },
                      { name: "subject", label: "Assunto", type: "text", required: true },
                      { name: "link", label: "Link", type: "url", required: false },
                      { name: "phone", label: "Telefone", type: "tel", required: false }
                    ]}
                    isDisabled={postEdit.saving}
                    tooltip="Adicione coautores do post"
                  />
                </div>
              </Tabs.Item>

              <Tabs.Item
                active={postEdit.activeTab === 3}
                title="Imagem de Capa"
              >
                <div className="p-6">
                  <FileManager
                    files={postEdit.files.cover || []}
                    onFilesChange={(files) => postEdit.handleFilesChange("cover", files)}
                    onFilesSelect={(files) => postEdit.handleFilesSelect("cover", files)}
                    isUploading={postEdit.saving}
                    disabled={postEdit.saving}
                    label="Imagens de Capa"
                    accept="image/*"
                  />
                </div>
              </Tabs.Item>
            </Tabs>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <KuButton
                id="update-post"
                type="button"
                actionType="submit"
                isDisabled={postEdit.saving}
                label={postEdit.saving ? t("posts.updating") : "Salvar"}
                customClass="flex items-center justify-center"
              >
                {postEdit.saving && <Spinner size="sm" className="mr-2" />}
              </KuButton>
              <Button
                type="button"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
                onClick={() => navigate("/posts")}
                disabled={postEdit.saving}
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
