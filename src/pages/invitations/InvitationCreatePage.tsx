import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import KuInput from "@/components/form/KuInput";
import KuSelect from "@/components/form/KuSelect";
import KuButton from "@/components/form/KuButton";
import { useToast } from "@/hooks/useToast";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useRoles } from "@/hooks/useRoles";
import { invitationsService } from "@/services/invitationsService";

export default function InvitationCreatePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const toast = useToast();
  const { workspace } = useWorkspace();
  const { roles } = useRoles();
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');

  const onSubmit = async () => {
    if (!workspace?.id || !workspace?.currentUserId || !email || !roleId) {
      toast.error(t("invitations.error.workspace_required"));
      return;
    }

    setLoading(true);
    try {
      await invitationsService.createInvitation({
        email: email,
        roleId: roleId,
        workspaceId: String(workspace.id),
        createdBy: workspace.currentUserId,
      });
      
      toast.success(t("invitations.create_success"));
      navigate("/invitations");
    } catch (err: any) {
      toast.error(err.message || t("invitations.error.create_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/invitations");
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {t("invitations.new_invitation")}
            </h1>

            <form onSubmit={onSubmit} className="space-y-6">
              <KuInput
                type="input"
                name="email"
                dataType="email"
                label={t("invitations.form.email")}
                placeholder={t("invitations.form.email_placeholder")}
                value={email || ""}
                onChange={(e) => setEmail(e.target.value)}
                error={""}
                isRequired
              />

              <KuSelect
                type="select"
                name="roleId"
                dataType="text"
                label={t("invitations.form.role")}
                placeholder={t("invitations.form.role_placeholder")}
                value={roleId || ""}
                onChange={(name, value) => setRoleId(String(value))}
                error={""}
                isRequired
                options={roles.map((role) => ({
                  label: role.name,
                  value: role._id || role.id || "",
                }))}
              />

              <div className="flex justify-end space-x-3">
                <KuButton
                  id="cancel-invitation"
                  type="button"
                  actionType="button"
                  label={t("common.cancel")}
                  onClick={handleCancel}
                  isDisabled={loading}
                />
                <KuButton
                  id="create-invitation"
                  type="button"
                  actionType="submit"
                  label={loading ? t("invitations.creating") : t("invitations.create")}
                  onClick={onSubmit}
                  isDisabled={loading}
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
