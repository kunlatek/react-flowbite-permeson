import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import KuInput from "@/components/form/KuInput";
import KuSelect from "@/components/form/KuSelect";
import KuButton from "@/components/form/KuButton";
import { useToast } from "@/hooks/useToast";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useRoles } from "@/hooks/useRoles";
import { invitationsService } from "@/services/invitationsService";

export default function InvitationEditPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();
  const { roles } = useRoles();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [invitation, setInvitation] = useState<any>(null);

  const [email, setEmail] = useState('');
  const [roleId, setRoleId] = useState('');

  useEffect(() => {
    const fetchInvitation = async () => {
      if (!id) return;
      
      try {
        setInitialLoading(true);
        const data = await invitationsService.getInvitationById(id);
        setInvitation(data);
        setEmail(data.email);
        setRoleId(data.roleId);
      } catch (err: any) {
        toast.error(err.message || t("invitations.error.fetch_failed"));
        navigate("/invitations");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchInvitation();
  }, [id, toast, t, navigate]);

  const onSubmit = async () => {
    if (!id) return;

    setLoading(true);
    try {
      await invitationsService.updateInvitation(id, {
        email: email,
        roleId: roleId,
      });
      
      toast.success(t("invitations.update_success"));
      navigate("/invitations");
    } catch (err: any) {
      toast.error(err.message || t("invitations.error.update_failed"));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/invitations");
  };

  if (initialLoading) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!invitation) {
    return (
      <div className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-2xl">
          <div className="bg-white shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <p className="text-gray-500">{t("invitations.not_found")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-2xl">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              {t("invitations.edit_invitation")}
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
                  id="cancel-edit-invitation"
                  type="button"
                  actionType="button"
                  label={t("common.cancel")}
                  onClick={handleCancel}
                  isDisabled={loading}
                />
                <KuButton
                  id="update-invitation"
                  type="button"
                  actionType="submit"
                  label={loading ? t("invitations.updating") : t("invitations.update")}
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
