import { useNavigate } from "react-router-dom";
import InvitationForm from "@/modules/invitation/components/invitation-form";
import { useCreateInvitation } from "../hooks/use-create-invitation";

export default function CreateInvitationPage() {
  const createInvitation = useCreateInvitation();
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Novo Convite</h1>
      <InvitationForm
        invitation={createInvitation.invitation}
        onInvitationChange={createInvitation.setInvitation}
        onSubmit={createInvitation.handleSubmit}
        onCancel={() => navigate("/invitations")}
        loading={createInvitation.loading}
      />
    </div>
  );
}
