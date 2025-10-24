import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { Badge } from "flowbite-react";
import type { IColumn, IAction, IHeaderAction } from "@/components/data/ku-data-table";
import type { IInvitation } from "../interfaces/invitation.interface";
import { fetchInvitations } from "../api/fetch-invitations";
import { sendInvitation } from "../api/send-invitation";

export const useInvitationList = () => {
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
            await sendInvitation(row._id);
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
    const getInvitations = async (params: URLSearchParams) => {
        const response = await fetchInvitations(params);
        return response.data;
    }

    return {
        columns,
        actions,
        headerActions,
        getInvitations,
    }
}