import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { createInvitation } from "../api/create-invitation";

interface InvitationFormData {
    email: string;
    role: string;
}

export const useCreateInvitation = () => {
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
            await createInvitation({
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

    return {
        invitation,
        setInvitation,
        loading,
        handleSubmit,
    };
}