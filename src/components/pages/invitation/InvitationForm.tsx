import { KuInput, KuSelect, KuButton } from "@/components/form";
import type { ISelectOption } from "@/models/form";

interface InvitationFormData {
  email: string;
  role: string;
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
  const rolesOptions: ISelectOption[] = [
    { label: "Admin", value: "admin" },
    { label: "User", value: "user" },
  ];

  return (
    <form onSubmit={onSubmit} className="max-w-lg">
      <div className="space-y-4">
        <KuInput
          type="input"
          dataType="email"
          name="email"
          label="Email"
          value={invitation.email || ""}
          onChange={(e) =>
            onInvitationChange({ ...invitation, email: e.target.value })
          }
          isRequired
        />
        <KuSelect
          type="select"
          dataType="text"
          name="role"
          label="Papel"
          options={rolesOptions}
          value={invitation.role || ""}
          onChange={(name, value) =>
            onInvitationChange({ ...invitation, role: String(value) })
          }
          isRequired
        />
      </div>
      <div className="flex justify-end space-x-4 mt-8">
        <KuButton
          id="cancel-invitation"
          type="button"
          actionType="link"
          variant="secondary"
          label="Cancelar"
          onClick={onCancel}
        />
        <KuButton
          id="submit-invitation"
          type="button"
          actionType="submit"
          label={loading ? "Enviando..." : "Enviar Convite"}
          isDisabled={loading}
        />
      </div>
    </form>
  );
}
