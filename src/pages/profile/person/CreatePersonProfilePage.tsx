import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import { profileService } from "@/services/profileService";
import PersonProfileForm from "@/components/pages/profile/PersonProfileForm";
import type { IPersonProfile } from "@/models/profile";

export default function CreatePersonProfilePage() {
  const [profile, setProfile] = useState<Partial<IPersonProfile>>({
    personLanguages: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { setSession } = useAuth();
  const toast = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const response = await profileService.createPersonProfile(profile);

      if (response && response.access_token) {
        setSession(response.access_token);
      }

      toast.success("Perfil criado com sucesso!");
      navigate("/dashboard");
    } catch (error: unknown) {
      toast.error("Erro ao criar perfil. Verifique os campos.");
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        Criar Perfil de Pessoa
      </h1>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        Preencha o formulário para criar seu perfil.
      </p>
      <PersonProfileForm
        profile={profile}
        onProfileChange={setProfile}
        onSubmit={handleSubmit}
        onCancel={() => navigate("/profile/select")}
        loading={loading}
        errors={errors}
      />
    </div>
  );
}
