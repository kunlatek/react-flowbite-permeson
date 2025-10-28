import { Card, Button, Spinner, Tabs, Badge, Label, Checkbox } from "flowbite-react";
import { HiArrowLeft, HiTrash, HiPlus } from "react-icons/hi";
import { KuInput, KuButton } from "@/components/form";
import { useCreateRole } from "../hooks/use-create-role";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function RoleCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const roleCreate = useCreateRole();

  return (
    <Card className="card">
      {/* Header */}
      <div className="mb-6">
        <Button
          className="mb-4 bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
          onClick={() => navigate("/roles")}
        >
          <HiArrowLeft className="mr-2 h-4 w-4" />
          {t("roles.back_to_list")}
        </Button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          {t("roles.new_role")}
        </h1>
        <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
          {t("roles.new_role_description")}
        </p>
      </div>

      {/* Form */}
      <Card>
        <form onSubmit={roleCreate.handleSubmit}>
          {/* Tabs for all information */}
          <Tabs
            aria-label="Role information tabs"
            onActiveTabChange={(tab: number) => roleCreate.setActiveTab(tab)}
          >
            <Tabs.Item
              active={roleCreate.activeTab === 0}
              title="Geral"
            >
              <div className="p-6 space-y-6">
                {/* Role Name */}
                <KuInput
                  type="input"
                  name="name"
                  label={t("roles.form.name")}
                  value={roleCreate.formData.name}
                  onChange={(e) => roleCreate.handleInputChange("name", e.target.value)}
                  dataType="text"
                  placeholder={t("roles.form.name_placeholder")}
                  isRequired={true}
                  isDisabled={roleCreate.loading}
                />
              </div>
            </Tabs.Item>

            <Tabs.Item
              active={roleCreate.activeTab === 1}
              title="Permissões"
            >
              <div className="p-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {t("roles.form.permissions")}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                    {t("roles.form.permissions_description")}
                  </p>

                  {/* Permissions List */}
                  <div className="space-y-4">
                    {roleCreate.formData.permissions.map((permission, index) => (
                      <div
                        key={index}
                        className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <h4 className="text-md font-medium text-gray-900 dark:text-white">
                            Permissão {index + 1}
                          </h4>
                          <Button
                            size="xs"
                            color="failure"
                            onClick={() => roleCreate.removePermission(index)}
                            disabled={roleCreate.loading}
                          >
                            <HiTrash className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Module Selection */}
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {t("roles.form.module")}
                              <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <select
                              value={permission.module}
                              onChange={(e) => roleCreate.updatePermission(index, 'module', e.target.value)}
                              disabled={roleCreate.loading}
                              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 focus:border-cyan-500 focus:ring-cyan-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-cyan-500 dark:focus:ring-cyan-500"
                            >
                              <option value="">{t("roles.form.select_module")}</option>
                              {roleCreate.moduleOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Actions Selection */}
                          <div>
                            <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                              {t("roles.form.actions")}
                              <span className="text-red-500 ml-1">*</span>
                            </Label>
                            <div className="space-y-2 max-h-32 overflow-y-auto">
                              {roleCreate.actionOptions.map((action) => (
                                <div key={action.value} className="flex items-center">
                                  <Checkbox
                                    id={`${index}-${action.value}`}
                                    checked={permission.actionList.includes(action.value)}
                                    onChange={() => roleCreate.toggleAction(index, action.value)}
                                    disabled={roleCreate.loading}
                                    className="mr-2"
                                  />
                                  <Label
                                    htmlFor={`${index}-${action.value}`}
                                    className="text-sm text-gray-900 dark:text-white cursor-pointer"
                                  >
                                    {action.label}
                                  </Label>
                                </div>
                              ))}
                            </div>
                            {permission.actionList.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {permission.actionList.map((action) => {
                                  const actionLabel = roleCreate.actionOptions.find(a => a.value === action)?.label;
                                  return (
                                    <Badge key={action} color="blue" className="text-xs">
                                      {actionLabel}
                                    </Badge>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Add Permission Button */}
                    <Button
                      type="button"
                      color="gray"
                      onClick={roleCreate.addPermission}
                      disabled={roleCreate.loading}
                      className="w-full"
                    >
                      <HiPlus className="mr-2 h-4 w-4" />
                      {t("roles.form.add_permission")}
                    </Button>

                    {roleCreate.formData.permissions.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        <p>{t("roles.form.permission_required")}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Tabs.Item>
          </Tabs>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <KuButton
              id="create-role"
              type="button"
              actionType="submit"
              isDisabled={roleCreate.loading}
              label={roleCreate.loading ? t("roles.creating") : t("roles.create")}
              customClass="flex items-center justify-center"
            >
              {roleCreate.loading && <Spinner size="sm" className="mr-2" />}
            </KuButton>
            <Button
              type="button"
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
              onClick={() => navigate("/roles")}
              disabled={roleCreate.loading}
            >
              {t("roles.cancel")}
            </Button>
          </div>
        </form>
      </Card>
    </Card>
  );
}
