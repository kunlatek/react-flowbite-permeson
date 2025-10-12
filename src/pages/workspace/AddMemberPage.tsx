import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, Button, TextInput, Spinner, Alert, Label, Select } from "flowbite-react";
import { HiSearch, HiUserAdd, HiArrowLeft, HiCheckCircle, HiShieldCheck } from "react-icons/hi";
import { useTranslation } from "react-i18next";
import { useUserSearch, useWorkspace } from "@/hooks/useWorkspace";
import { useRoles } from "@/hooks/useRoles";
import type { IUserSearch } from "@/models/workspace";

export default function AddMemberPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<IUserSearch | null>(null);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("");
  const [adding, setAdding] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const { searchResults, searching, searchUsers } = useUserSearch();
  const { workspace, addMember } = useWorkspace();
  const { roles, loading: rolesLoading } = useRoles();

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
    const success = await addMember(selectedUser.userId, selectedRoleId || undefined);
    if (success) {
      setSuccess(true);
      // Reset form
      setSearchTerm("");
      setSelectedUser(null);
      setSelectedRoleId("");
      // Auto redirect after 2 seconds
      setTimeout(() => {
        navigate("/workspace");
      }, 2000);
    }
    setAdding(false);
  };

  const handleBack = () => {
    navigate("/workspace");
  };

  const handleUserSelect = (user: IUserSearch) => {
    setSelectedUser(user);
  };

  const currentTeamMembers = workspace?.team || [];

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        {/* Header com botão de voltar */}
        <div className="mb-6">
          <Button onClick={handleBack} color="gray">
            <HiArrowLeft className="mr-2 h-4 w-4" />
            {t("common.back")}
          </Button>
        </div>

        <Card>
          <div className="space-y-6">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("workspace.add_member_title")}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {t("workspace.add_member_description")}
              </p>
            </div>

            {/* Success Message */}
            {success && (
              <Alert color="success">
                <span className="font-medium">{t("workspace.member_added_success")}</span>
                <span className="ml-2">{t("workspace.redirecting")}</span>
              </Alert>
            )}

            <div className="space-y-4">
              {/* Search Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t("workspace.search_user_label")}
                </label>
                <TextInput
                  type="text"
                  placeholder={t("workspace.search_user_placeholder")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={searching || adding}
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {t("workspace.search_user_help")}
                </p>
              </div>

              {/* Search Results */}
              {searchTerm && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t("workspace.search_results")}
                  </label>
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
                              className={`p-3 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                                selectedUser?.userId === user.userId ? 'bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-500' : ''
                              }`}
                              onClick={() => !adding && handleUserSelect(user)}
                            >
                              <div className="font-medium text-gray-900 dark:text-white">
                                {user.userName}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                ID: {user.userId}
                              </div>
                            </div>
                          ))}
                        {searchResults.filter(user => currentTeamMembers.includes(user.userId)).length > 0 && (
                          <div className="p-3 bg-gray-100 dark:bg-gray-800 text-gray-500 text-sm border-t">
                            <div className="font-medium">{t("workspace.already_in_team")}</div>
                            <div className="text-xs mt-1">
                              {searchResults.filter(user => currentTeamMembers.includes(user.userId))
                                .map(user => user.userName).join(", ")}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        {t("workspace.no_users_found")}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Selected User */}
              {selectedUser && (
                <div className="p-4 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700">
                  <div className="flex items-center">
                    <HiUserAdd className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                    <div>
                      <div className="font-medium text-green-800 dark:text-green-200">
                        {t("workspace.selected_user")}:
                      </div>
                      <div className="text-green-700 dark:text-green-300">
                        {selectedUser.userName}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Role Selection */}
              {selectedUser && (
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    <HiShieldCheck className="inline h-4 w-4 mr-1" />
                    {t("workspace.select_role_label")}
                  </Label>
                  <Select
                    value={selectedRoleId}
                    onChange={(e) => setSelectedRoleId(e.target.value)}
                    disabled={adding || rolesLoading}
                  >
                    <option value="">
                      {rolesLoading ? t("workspace.loading_roles") : t("workspace.select_role_placeholder")}
                    </option>
                    {roles.map((role) => (
                      <option key={role._id || role.id} value={role._id || role.id}>
                        {role.name}
                      </option>
                    ))}
                  </Select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {t("workspace.select_role_help")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end gap-3">
          <Button
            color="gray"
            onClick={handleBack}
            disabled={adding}
          >
            {t("common.cancel")}
          </Button>
          <Button
            color="primary"
            className="bg-blue-600 hover:bg-blue-700 text-white border-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:text-white"
            onClick={handleAddMember}
            disabled={!selectedUser || adding}
            isProcessing={adding}
          >
            <HiUserAdd className="mr-2 h-4 w-4" />
            {t("workspace.add_member")}
          </Button>
        </div>
      </div>
    </div>
  );
}
