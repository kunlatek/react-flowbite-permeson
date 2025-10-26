import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { updateInvitation } from "../api/update-invitation";
import { fetchInvitationById } from "../api/fetch-invitations";

interface InvitationFormData {
    email: string;
    role: string;
}
export const useUpdateInvitation = () => {
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
      fetchInvitationById(id)
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
        await updateInvitation(id, {
          email: invitation.email,
          role: invitation.role,
        });
        toast.success("Convite atualizado com sucesso!");
        navigate("/invitations");
      } catch (err: unknown) {
        console.error("Failed to update invitation:", err);
        let message = "Falha ao atualizar o convite.";
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    return {
        invitation,
        setInvitation,
        loading,
        handleSubmit,
    };
}