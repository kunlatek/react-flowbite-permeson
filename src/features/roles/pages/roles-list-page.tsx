import { useTranslation } from "react-i18next";
import KuDataTable from "@/components/data/ku-data-table";
import RoleDeleteConfirm from "@/features/roles/components/role-delete-confirm";
import type { IRoleTable } from "../interfaces";
import { useRolesList } from "../hooks/use-roles-list";
import { useUserPermissions } from "@/hooks/use-user-permissions";

export default function RolesListPage() {
  const { t } = useTranslation();
  const { permissions } = useUserPermissions();
  const rolesList = useRolesList(permissions);

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl">
        <KuDataTable<IRoleTable>
          title={t("roles.title")}
          columns={rolesList.columns}
          dataSource={rolesList.getRoles}
          getActions={rolesList.getActions}
          headerActions={rolesList.headerActions}
          pageSize={10}
        />
      </div>

      {/* Modal de confirmação de exclusão */}
      <RoleDeleteConfirm
        role={rolesList.roleToDelete}
        show={rolesList.deleteModalOpen}
        loading={rolesList.deleteLoading}
        onClose={rolesList.handleDeleteCancel}
        onConfirm={rolesList.handleDeleteConfirm}
      />
    </div>
  );
}
