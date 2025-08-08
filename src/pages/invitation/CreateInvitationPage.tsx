import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/useToast";
import { invitationsService } from "@/services/invitationsService";
import InvitationForm from "@/components/pages/invitation/InvitationForm";

interface InvitationFormData {
  email: string;
  role: string;
}

export default function CreateInvitationPage() {
  const [invitation, setInvitation] = useState<Partial<InvitationFormData>>({
    email: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!invitation.email || !invitation.role) {
      toast.error("Email e Papel são obrigatórios.");
      return;
    }
    setLoading(true);
    try {
      await invitationsService.createInvitation({
        email: invitation.email,
        role: invitation.role,
      });
      toast.success("Convite criado com sucesso!");
      navigate("/invitations");
    } catch (err: unknown) {
      console.error("Failed to create invitation:", err);
      let message = "Falha ao criar o convite.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">Novo Convite</h1>
      <InvitationForm
        invitation={invitation}
        onInvitationChange={setInvitation}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/invitations")}
        loading={loading}
      />
    </div>
  );
}
