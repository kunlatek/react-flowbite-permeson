import { KuInput, KuButton } from "@/components/form";

interface InvitationFormData {
  email: string;
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
