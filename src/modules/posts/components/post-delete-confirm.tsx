
import { useTranslation } from "react-i18next";
import { Modal, Button } from "flowbite-react";
import { HiTrash } from "react-icons/hi";

interface PostDeleteConfirmProps {
  show: boolean;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function PostDeleteConfirm({
  show,
  loading = false,
  onClose,
  onConfirm,
}: PostDeleteConfirmProps) {
  const { t } = useTranslation();

  return (
    <Modal 
      show={show} 
      onClose={onClose} 
      size="md" 
      position="center"
      className="backdrop-blur-sm"
    >
      <Modal.Header className="px-6 py-4">
        {t("posts.delete_title")}
      </Modal.Header>
      <Modal.Body className="px-6 py-4">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
            <HiTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            {t("posts.confirm_delete_title")}
          </h3>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {t("posts.delete_warning")}
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer className="px-6 py-4">
        <Button
          color="gray"
          onClick={onClose}
          disabled={loading}
        >
          {t("common.cancel")}
        </Button>
        <Button
          color="failure"
          onClick={onConfirm}
          disabled={loading}
          isProcessing={loading}
        >
          <HiTrash className="mr-2 h-4 w-4" />
          {t("posts.delete")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
