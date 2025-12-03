import { KuDataTable } from "@/components/ku-components";
import { useInvitationList } from "../hooks/use-invitation-list";
import { KuCard } from "@/components/ku-components";
import { useTranslation } from "react-i18next";

export const InvitationListPage = () => {
  const { t } = useTranslation();
  const invitationList = useInvitationList();

  return (
    <KuCard>
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
    </KuCard>
  );
};

export default InvitationListPage;
