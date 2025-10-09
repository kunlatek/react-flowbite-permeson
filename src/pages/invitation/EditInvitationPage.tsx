import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useToast } from "@/hooks/useToast";
import { invitationsService } from "@/services/invitationsService";
import InvitationForm from "@/components/pages/invitation/InvitationForm";
import { Spinner } from "flowbite-react";

interface InvitationFormData {
  email: string;
  role: string;
}

export default function EditInvitationPage() {
  const [invitation, setInvitation] = useState<Partial<InvitationFormData>>({});
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) {
      navigate("/invitations");
      return;
    }
    invitationsService
      .getInvitationById(id)
      .then((data) => setInvitation({ email: data.email, role: data.role }))
      .catch((err: unknown) => {
        console.error("Failed to load invitation:", err);
        toast.error("Falha ao carregar o convite.");
      })
      .finally(() => setPageLoading(false));
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !invitation.email || !invitation.role) return;

    setLoading(true);
    try {
      await invitationsService.updateInvitation(id, {
        email: invitation.email,
        role: invitation.role,
      });
      toast.success("Convite atualizado com sucesso!");
      navigate("/invitations");
    } catch (err: unknown) {
      console.error("Failed to update invitation:", err);
      let message = "Falha ao atualizar o convite.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
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
        invitation={invitation}
        onInvitationChange={setInvitation}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/invitations")}
        loading={loading}
      />
    </div>
  );
}
