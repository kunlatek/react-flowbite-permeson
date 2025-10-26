import { useNavigate } from "react-router-dom";
import InvitationForm from "@/modules/invitation/components/invitation-form";
import { Spinner } from "flowbite-react";
import { useUpdateInvitation } from "../hooks/use-update-invitation";

export default function UpdateInvitationPage() {
  const updateInvitation = useUpdateInvitation();
  const navigate = useNavigate();

  if (updateInvitation.loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Editar Convite
      </h1>
      <InvitationForm
        invitation={updateInvitation.invitation}
        onInvitationChange={updateInvitation.setInvitation}
        onSubmit={updateInvitation.handleSubmit}
        onCancel={() => navigate("/invitations")}
        loading={updateInvitation.loading}
      />
    </div>
  );
}
