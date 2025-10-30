import { KuInput, KuButton, KuAutocomplete } from "@/components/ku-components";
import type { ISelectOption } from "@/models/form";
import { useTranslation } from "react-i18next";

interface InvitationFormData {
  email: string;
  roleId: string;
}

interface InvitationFormProps {
  invitation: Partial<InvitationFormData>;
  onInvitationChange: (data: Partial<InvitationFormData>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function InvitationForm({
  invitation,
  onInvitationChange,
  onSubmit,
  onCancel,
  loading,
}: InvitationFormProps) {
  const { t } = useTranslation();

  return (
    <form onSubmit={onSubmit}>
      <div className="space-y-4">
        <KuInput
          dataType="email"
          name="email"
          label="Email"
          value={invitation.email || ""}
          onChange={(e) =>
            onInvitationChange({ ...invitation, email: e.target.value })
          }
          isRequired
        />
        <KuAutocomplete
          type="autocomplete"
          dataType="text"
          name="roleId"
          value={invitation.roleId ? [{ label: invitation.roleId, value: invitation.roleId }] : []}
          label={t("roles.title")}
          optionsApi={{
            endpoint: "/api/roles",
            labelField: ["role.name"],
            valueField: "id",
            paramsToFilter: ["name"],
            paramType: "query",
          }}
          onChange={(name, value) => 
            onInvitationChange({ ...invitation, roleId: (value as ISelectOption)?.value?.toString() ?? "" })
          }
          isRequired={true}
          isMultiple={false}
          isUnique={true}
          isDisabled={loading}
          isAutofocus={false}
          conditions={[]}
          formState={{ roleId: invitation.roleId || "" }}
        />
      </div>
      <div className="flex justify-end space-x-4 mt-8">
        <KuButton
          id="cancel-invitation"
          type="button"
          actionType="link"
          variant="secondary"
          label={t("common.cancel")}
          onClick={onCancel}
        />
        <KuButton
          id="submit-invitation"
          type="button"
          actionType="submit"
          label={loading ? t("common.loading") : t("invitations.send_invitation")}
          isDisabled={loading}
        />
      </div>
    </form>
  );
}
