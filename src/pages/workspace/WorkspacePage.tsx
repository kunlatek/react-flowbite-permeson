import { useState } from "react";
import { Card, Button, Spinner, Alert, Modal } from "flowbite-react";
import { HiUserAdd, HiRefresh, HiTrash } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useWorkspace } from "@/hooks/useWorkspace";
import AddMemberModal from "@/components/workspace/AddMemberModal";

export default function WorkspacePage() {
  const { t } = useTranslation();
  const { workspace, loading, error, fetchWorkspace, addMember, removeMember } = useWorkspace();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [removeModalOpen, setRemoveModalOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<{ userId: string; userName?: string } | null>(null);
  
  // Debug logs
  console.log('WorkspacePage - workspace state:', workspace);
  console.log('WorkspacePage - team array:', workspace?.team);
  console.log('WorkspacePage - team length:', workspace?.team?.length);

  const handleAddMember = async (userId: string) => {
    return await addMember(userId);
  };

  const handleRemoveMember = async (userId: string) => {
    const success = await removeMember(userId);
    if (success) {
      setRemoveModalOpen(false);
      setUserToRemove(null);
    }
  };

  const handleRefresh = () => {
    fetchWorkspace();
  };

  const openRemoveModal = (userId: string, userName?: string) => {
    setUserToRemove({ userId, userName });
    setRemoveModalOpen(true);
  };

  if (loading && !workspace) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-center items-center h-64">
            <Spinner size="xl" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
        <div className="mx-auto max-w-7xl">
          <Alert color="failure">
            <span className="font-medium">{t("workspace.error_title")}</span>
            <p>{error}</p>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {t("workspace.title")}
              </h1>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {t("workspace.description")}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                color="gray"
                onClick={handleRefresh}
                disabled={loading}
                isProcessing={loading}
              >
                <HiRefresh className="mr-2 h-4 w-4" />
                {t("workspace.refresh")}
              </Button>
              <Button
                color="primary"
                onClick={() => setIsModalOpen(true)}
                disabled={loading}
              >
                <HiUserAdd className="mr-2 h-4 w-4" />
                {t("workspace.add_member")}
              </Button>
            </div>
          </div>
        </div>

        {/* Team Members List */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {t("workspace.team_members")}
            </h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {workspace?.team?.length || 0} {t("workspace.members")}
            </span>
          </div>

          {workspace?.team && workspace.team.length > 0 ? (
            <div className="grid gap-4">
              {workspace.team.map((userId, index) => {
                // Encontrar informações do usuário (convertendo para string para garantir compatibilidade)
                const userInfo = workspace.teamMembers?.find(member => String(member.userId) === String(userId));
                
                // Verificar se é o dono do workspace
                const isOwner = String(userId) === String(workspace.currentUserId);
                
                // Debug logs
                console.log(`User ${userId}:`, userInfo, 'isOwner:', isOwner);
                console.log('All teamMembers:', workspace.teamMembers);
                
                return (
                  <div
                    key={userId}
                    className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 ${
                      isOwner 
                        ? 'border-green-300 bg-green-50 dark:bg-green-900/20 dark:border-green-700' 
                        : 'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isOwner 
                          ? 'bg-green-100 dark:bg-green-900' 
                          : 'bg-blue-100 dark:bg-blue-900'
                      }`}>
                        <span className={`text-sm font-medium ${
                          isOwner 
                            ? 'text-green-800 dark:text-green-200' 
                            : 'text-blue-800 dark:text-blue-200'
                        }`}>
                          {userInfo?.userName?.charAt(1).toUpperCase() || userId.charAt(1).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white flex items-center gap-2">
                          {userInfo?.userName || `${t("workspace.user_id")}: ${userId}`}
                          {isOwner && (
                            <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
                              {t("workspace.owner")}
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {userInfo ? `ID: ${userId}` : (loading ? t("workspace.loading_names") : t("workspace.user_id"))}
                          {isOwner && ` (${t(`workspace.profile_type.${workspace.currentUserType}`)})`}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        #{index + 1}
                      </div>
                      {!isOwner && (
                        <Button
                          size="sm"
                          color="failure"
                          onClick={() => openRemoveModal(userId, userInfo?.userName)}
                          disabled={loading}
                          className="ml-2"
                        >
                          <HiTrash className="h-8 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 dark:text-gray-500 mb-4">
                <HiUserAdd className="mx-auto h-12 w-12" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t("workspace.no_members_title")}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                {t("workspace.no_members_description")}
              </p>
              <Button
                color="primary"
                onClick={() => setIsModalOpen(true)}
              >
                <HiUserAdd className="mr-2 h-4 w-4" />
                {t("workspace.add_first_member")}
              </Button>
            </div>
          )}
        </Card>

        {/* Add Member Modal */}
        <AddMemberModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddMember={handleAddMember}
          currentTeamMembers={workspace?.team || []}
        />

        {/* Remove Member Confirmation Modal */}
        <Modal show={removeModalOpen} onClose={() => setRemoveModalOpen(false)} size="md">
          <Modal.Header>
            {t("workspace.remove_member_title")}
          </Modal.Header>
          <Modal.Body>
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900 mb-4">
                <HiTrash className="h-6 w-6 text-red-600 dark:text-red-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {t("workspace.remove_member_confirm")}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {userToRemove?.userName ? (
                  <>
                    {t("workspace.remove_member_description")} <strong>{userToRemove.userName}</strong>?
                  </>
                ) : (
                  <>
                    {t("workspace.remove_member_description")} <strong>ID: {userToRemove?.userId}</strong>?
                  </>
                )}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                {t("workspace.remove_member_warning")}
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              color="gray"
              onClick={() => setRemoveModalOpen(false)}
              disabled={loading}
            >
              {t("common.cancel")}
            </Button>
            <Button
              color="failure"
              onClick={() => userToRemove && handleRemoveMember(userToRemove.userId)}
              disabled={loading}
              isProcessing={loading}
            >
              <HiTrash className="mr-2 h-4 w-4" />
              {t("workspace.remove_member")}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
