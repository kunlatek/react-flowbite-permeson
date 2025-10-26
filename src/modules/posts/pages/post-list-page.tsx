import { useTranslation } from "react-i18next";
import { KuDataTable } from "@/components/data";
import PostDeleteConfirm from "@/modules/posts/components/post-delete-confirm";
import type { IPost } from "../interfaces/post.interface";
import { usePostLists } from "../hooks/use-posts";

export default function PostListPage() {
  const { t } = useTranslation();
  
  const postLists = usePostLists();

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <KuDataTable<IPost>
          title={t("posts.title")}
          columns={postLists.columns}
          dataSource={postLists.fetchPosts}
          getActions={postLists.getActions}
          headerActions={postLists.headerActions}
          pageSize={10}
        />
      </div>

      {/* Modal de confirmação de exclusão */}
      <PostDeleteConfirm
        show={postLists.deleteModalOpen}
        loading={postLists.deleteLoading}
        onClose={postLists.handleDeleteCancel}
        onConfirm={postLists.handleDeleteConfirm}
      />
    </div>
  );
}
