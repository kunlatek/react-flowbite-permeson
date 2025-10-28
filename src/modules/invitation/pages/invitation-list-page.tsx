import { KuDataTable } from "@/components/ku-components";
import { useInvitationList } from "../hooks/use-invitation-list";
import { Card } from "flowbite-react";
import { useTranslation } from "react-i18next";

export const InvitationListPage = () => {
  const { t } = useTranslation();
  const invitationList = useInvitationList();

  return (
    <Card className="card">
      <KuDataTable
        title={t("invitations.title")}
        columns={invitationList.columns}
        dataSource={async (params: URLSearchParams) => {
          const response = await invitationList.getInvitations(params);
          return { data: response, total: response.length };
        }}
        actions={invitationList.actions}
        headerActions={invitationList.headerActions}
      />
    </Card>
  );
};

export default InvitationListPage;
