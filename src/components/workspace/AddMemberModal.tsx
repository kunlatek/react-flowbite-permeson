import { useState, useEffect } from "react";
import { Modal, Button, TextInput, Spinner } from "flowbite-react";
import { HiSearch, HiUserAdd } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useUserSearch } from "@/hooks/useWorkspace";
import type { IUserSearch } from "@/models/workspace";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMember: (userId: string) => Promise<boolean>;
  currentTeamMembers?: string[]; // Lista de userIds atuais no time
}

export default function AddMemberModal({ isOpen, onClose, onAddMember, currentTeamMembers = [] }: AddMemberModalProps) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUserSearch | null>(null);
  const [adding, setAdding] = useState(false);
  
  const { searchResults, searching, searchUsers } = useUserSearch();
  
  // Debug log
  console.log('Modal searchResults:', searchResults);
  console.log('Modal searchTerm:', searchTerm);

  useEffect(() => {
    if (searchTerm && searchTerm.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchUsers(searchTerm);
      }, 300);
      
      return () => clearTimeout(timeoutId);
    } else if (searchTerm.length < 2) {
      // Limpar resultados se o termo for muito curto
      searchUsers("");
    }
  }, [searchTerm]);

  const handleAddMember = async () => {
    if (!selectedUser) return;
    
    setAdding(true);
    const success = await onAddMember(selectedUser.userId);
    if (success) {
      handleClose();
    }
    setAdding(false);
  };

  const handleClose = () => {
    setSearchTerm("");
    setSelectedUser(null);
    onClose();
  };

  const handleUserSelect = (user: IUserSearch) => {
    setSelectedUser(user);
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <Modal.Header>
        {t("workspace.add_member_title")}
      </Modal.Header>
      
      <Modal.Body>
        <div className="space-y-4">
          {/* Search Input */}
          <div>
            <TextInput
              type="text"
              placeholder={t("workspace.search_user_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            //   icon={searching ? <Spinner size="sm" className="mr-2" /> : HiSearch}
              disabled={searching}
            />
          </div>

          {/* Search Results */}
          {searchTerm && (
            <div className="max-h-60 overflow-y-auto border rounded-lg">
              {searching ? (
                <div className="p-4 text-center text-gray-500">
                  <Spinner size="sm" className="mr-2" />
                  {t("workspace.searching")}
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y">
                  {searchResults
                    .filter(user => !currentTeamMembers.includes(user.userId))
                    .map((user) => (
                      <div
                        key={user.userId}
                        className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                          selectedUser?.userId === user.userId ? 'bg-blue-50 dark:bg-blue-900' : ''
                        }`}
                        onClick={() => handleUserSelect(user)}
                      >
                        <div className="font-medium">{user.userName}</div>
                        <div className="text-sm text-gray-500">ID: {user.userId}</div>
                      </div>
                    ))}
                  {searchResults.filter(user => currentTeamMembers.includes(user.userId)).length > 0 && (
                    <div className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm">
                      {t("workspace.already_in_team")}
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 text-center text-gray-500">
                  {t("workspace.no_users_found")}
                </div>
              )}
            </div>
          )}

          {/* Selected User */}
          {selectedUser && (
            <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg">
              <div className="font-medium text-green-800 dark:text-green-200">
                {t("workspace.selected_user")}:
              </div>
              <div className="text-green-700 dark:text-green-300">
                {selectedUser.userName} (ID: {selectedUser.userId})
              </div>
            </div>
          )}
        </div>
      </Modal.Body>
      
      <Modal.Footer>
        <Button
          color="gray"
          onClick={handleClose}
          disabled={adding}
        >
          {t("common.cancel")}
        </Button>
        <Button
          color="primary"
          onClick={handleAddMember}
          disabled={!selectedUser || adding}
          isProcessing={adding}
        >
          <HiUserAdd className="mr-2 h-4 w-4" />
          {t("workspace.add_member")}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
