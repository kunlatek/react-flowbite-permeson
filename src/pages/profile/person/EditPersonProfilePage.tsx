import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Spinner } from "flowbite-react";
import { useToast } from "@/hooks/useToast";
import { profileService } from "@/services/profileService";
import PersonProfileForm from "@/components/pages/profile/PersonProfileForm";
import type { IPersonProfile } from "@/models/profile";

export default function EditPersonProfilePage() {
  const [profile, setProfile] = useState<Partial<IPersonProfile> | null>(null);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const toast = useToast();

  useEffect(() => {
    if (!id) {
      toast.error("ID de perfil inválido.");
      navigate("/dashboard");
      return;
    }

    profileService
      .getPersonProfileById(id)
      .then((data) => {
        if (data.birthday) {
          data.birthday = new Date(data.birthday).toISOString().split("T")[0];
        }
        if (data.rgIssuanceDate) {
          data.rgIssuanceDate = new Date(data.rgIssuanceDate)
            .toISOString()
            .split("T")[0];
        }
        setProfile(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Não foi possível carregar o perfil.");
      })
      .finally(() => setPageLoading(false));
  }, [id, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !profile) return;

    setLoading(true);
    setErrors({});

    try {
      await profileService.updatePersonProfile(id, profile);
      toast.success("Perfil atualizado com sucesso!");
      navigate("/dashboard");
    } catch (error: unknown) {
      toast.error("Erro ao atualizar perfil. Verifique os campos.");
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      console.error(error);
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

  if (!profile) {
    return <div className="text-center py-10">Perfil não encontrado.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Editar Perfil de Pessoa
      </h1>
      <PersonProfileForm
        profile={profile}
        onProfileChange={setProfile}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/dashboard")}
        loading={loading}
        errors={errors}
      />
    </div>
  );
}
