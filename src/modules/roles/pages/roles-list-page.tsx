import { useTranslation } from "react-i18next";
import { KuDataTable } from "@/components/data";
import RoleDeleteConfirm from "@/modules/roles/components/role-delete-confirm";
import type { IRoleTable } from "../interfaces";
import { useRolesList } from "../hooks/use-roles-list";
import { useUserPermissions } from "@/hooks/use-user-permissions";
import { Card } from "flowbite-react";

export default function RolesListPage() {
  const { t } = useTranslation();
  const { permissions } = useUserPermissions();
  const rolesList = useRolesList(permissions);

  return (
    <Card className="card">
      <KuDataTable<IRoleTable>
        title={t("roles.title")}
        columns={rolesList.columns}
        dataSource={rolesList.getRoles}
        getActions={rolesList.getActions}
        headerActions={rolesList.headerActions}
        pageSize={10}
      />

      {/* Modal de confirmação de exclusão */}
      <RoleDeleteConfirm
        role={rolesList.roleToDelete}
        show={rolesList.deleteModalOpen}
        loading={rolesList.deleteLoading}
        onClose={rolesList.handleDeleteCancel}
        onConfirm={rolesList.handleDeleteConfirm}
      />
    </Card>
  );
}
