import { useNavigate } from "react-router-dom";
import InvitationForm from "@/modules/invitation/components/invitation-form";
import { useCreateInvitation } from "../hooks/use-create-invitation";
import { KuCard } from "@/components/ku-components";
import { useTranslation } from "react-i18next";

export const CreateInvitationPage = () => {
  const { t } = useTranslation();
  const createInvitation = useCreateInvitation();
  const navigate = useNavigate();

  return (
    <KuCard>
      <>
        <h1 className="title">{t("invitations.create_invitation")}</h1>
        <InvitationForm
          invitation={createInvitation.invitation}
          onInvitationChange={createInvitation.setInvitation}
          onSubmit={createInvitation.handleSubmit}
          onCancel={() => navigate("/invitations")}
          loading={createInvitation.loading}
        />
      </>
    </KuCard>
  );
};

export default CreateInvitationPage;