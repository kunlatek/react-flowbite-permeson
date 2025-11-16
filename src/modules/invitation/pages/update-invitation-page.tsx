import { useNavigate } from "react-router-dom";
import InvitationForm from "@/modules/invitation/components/invitation-form";
import { Card } from "flowbite-react";
import { useUpdateInvitation } from "../hooks/use-update-invitation";
import { useTranslation } from "react-i18next";
import { KuSpinner } from "@/components/ku-components";

export const UpdateInvitationPage = () => {
  const { t } = useTranslation();
  const updateInvitation = useUpdateInvitation();
  const navigate = useNavigate();

  if (updateInvitation.loading) {
    return (
      <div className="flex justify-center py-10">
        <KuSpinner />
      </div>
    );
  }

  return (
    <KuCard className="card">
      <h1 className="title">{t("invitations.edit_invitation")}</h1>
      <InvitationForm
        invitation={updateInvitation.invitation}
        onInvitationChange={updateInvitation.setInvitation}
        onSubmit={updateInvitation.handleSubmit}
        onCancel={() => navigate("/invitations")}
        loading={updateInvitation.loading}
      />
    </KuCard>
  );
};

export default UpdateInvitationPage;