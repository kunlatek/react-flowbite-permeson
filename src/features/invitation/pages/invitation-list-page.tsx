import KuDataTable from "@/components/data/ku-data-table";
import { useInvitationList } from "../hooks/use-invitation-list";

export default function InvitationListPage() {
  const invitationList = useInvitationList();

  return (
    <KuDataTable
      title="Convites"
      columns={invitationList.columns}
      dataSource={async (params: URLSearchParams) => {
        const response = await invitationList.getInvitations(params);
        return { data: response, total: response.length };
      }}
      actions={invitationList.actions}
      headerActions={invitationList.headerActions}
    />
  );
}
