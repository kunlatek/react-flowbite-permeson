import { useNavigate } from "react-router-dom";
import { Badge } from "flowbite-react";
import { useToast } from "@/hooks/useToast";
import { invitationsService } from "@/services/invitationsService";
import type { IInvitation } from "@/models/invitation";
import KuDataTable, {
  type IColumn,
  type IAction,
  type IHeaderAction,
} from "@/components/data/ku-data-table";

export default function InvitationListPage() {
  const navigate = useNavigate();
  const toast = useToast();

  const columns: IColumn<IInvitation>[] = [
    { key: "email", header: "Email", sortable: true },
    { key: "role", header: "Papel", sortable: true },
    {
      key: "accepted",
      header: "Status",
      formatValue: (value: unknown) => {
        const isAccepted = !!value;
        return (
          <Badge color={isAccepted ? "success" : "warning"}>
            {isAccepted ? "Aceito" : "Pendente"}
          </Badge>
        );
      },
    },
  ];

  const actions: IAction<IInvitation>[] = [
    {
      label: "Editar",
      color: "secondary",
      handler: (row) => navigate(`/invitations/${row._id}/edit`),
    },
    {
      label: "Reenviar",
      color: "secondary",
      handler: async (row) => {
        try {
          await invitationsService.sendInvitation(row._id);
          toast.success("Convite reenviado com sucesso!");
        } catch (err: unknown) {
          console.error("Failed to resend invitation:", err);
          toast.error("Falha ao reenviar o convite.");
        }
      },
    },
  ];

  const headerActions: IHeaderAction[] = [
    { label: "Novo Convite", handler: () => navigate("/invitations/new") },
  ];

  return (
    <KuDataTable
      title="Convites"
      columns={columns}
      dataSource={invitationsService.getInvitations}
      actions={actions}
      headerActions={headerActions}
    />
  );
}
