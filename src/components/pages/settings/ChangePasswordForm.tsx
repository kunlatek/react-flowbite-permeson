import { useState } from "react";
import { Alert } from "flowbite-react";
import axios from "axios";
import { KuInput, KuButton } from "@/components/form";
import { userService } from "@/services/userService";
import { useToast } from "@/hooks/useToast";

interface ChangePasswordFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ChangePasswordForm({
  onSuccess,
  onCancel,
}: ChangePasswordFormProps) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const handleSubmit = async () => {
    setError("");
    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("As novas senhas não coincidem.");
      return;
    }

    setLoading(true);
    try {
      await userService.changePassword(oldPassword, newPassword);
      toast.success("Senha alterada com sucesso!");
      onSuccess();
    } catch (err: unknown) {
      let message = "Erro ao alterar a senha.";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && <Alert color="failure">{error}</Alert>}
      <KuInput
        type="input"
        name="oldPassword"
        dataType="password"
        label="Senha Atual"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        isRequired
      />
      <KuInput
        type="input"
        name="newPassword"
        dataType="password"
        label="Nova Senha"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        isRequired
      />
      <KuInput
        type="input"
        name="confirmPassword"
        dataType="password"
        label="Confirmar Nova Senha"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        isRequired
      />
      <div className="flex justify-end gap-2 pt-4">
        <KuButton
          id="cancel-pass"
          type="button"
          actionType="link"
          variant="secondary"
          label="Cancelar"
          onClick={onCancel}
        />
        <KuButton
          id="submit-pass"
          type="button"
          actionType="apiRequest"
          label="Alterar Senha"
          onClick={handleSubmit}
          isDisabled={loading}
        />
      </div>
    </div>
  );
}
