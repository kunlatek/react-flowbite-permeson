import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import KuDataTable, { type IColumn, type IAction, type IHeaderAction } from "@/components/data/KuDataTable";
import { useToast } from "@/hooks/useToast";
import { useWorkspace } from "@/hooks/useWorkspace";
import { postsService } from "@/services/postsService";
import PostViewModal from "@/components/pages/posts/PostViewModal";
import type { IPost, IPostsResponse } from "@/models/posts";

export default function PostsListPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { workspace } = useWorkspace();
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);

  const handleView = (post: IPost) => {
    setSelectedPost(post);
    setViewModalOpen(true);
  };

  const canEditPost = (post: IPost) => {
    if (!workspace?.currentUserId) return false;
    
    const isOwner = workspace.isOwner;
    const isCreator = String(post.createdBy) === String(workspace.currentUserId);
    
    return isOwner || isCreator;
  };

  const handleDelete = async (post: IPost) => {
    if (!window.confirm(t("posts.confirm_delete", { title: post.title }))) {
      return;
    }

    try {
      await postsService.deletePost(post._id);
      toast.success(t("posts.delete_success"));
    } catch (err: any) {
      toast.error(err.message || t("posts.error.delete_failed"));
    }
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
  const fetchPosts = async (params: URLSearchParams) => {
    const page = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || 10;
    
    const response: IPostsResponse = await postsService.getPosts(page, limit);
    
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
      baseActions.push(
        {
          label: t("posts.edit"),
          color: "primary",
          handler: (post) => navigate(`/posts/${post._id}/edit`),
        },
        {
          label: t("posts.delete"),
          color: "danger",
          handler: handleDelete,
        }
      );
    }

    return baseActions;
  };

  // Ações do header
  const headerActions: IHeaderAction[] = [
    {
      label: t("posts.new_post"),
      color: "primary",
      handler: () => navigate("/posts/new"),
    },
  ];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <KuDataTable<IPost>
          title={t("posts.title")}
          columns={columns}
          dataSource={fetchPosts}
          getActions={getActions}
          headerActions={headerActions}
          pageSize={10}
        />
      </div>

      {/* Modal de visualização */}
      <PostViewModal
        show={viewModalOpen}
        onClose={() => {
          setViewModalOpen(false);
          setSelectedPost(null);
        }}
        post={selectedPost}
      />
    </div>
  );
}
