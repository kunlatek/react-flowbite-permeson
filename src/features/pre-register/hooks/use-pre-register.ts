import { useState } from 'react';
import { useToast } from '@/hooks/useToast';
import { preRegister } from '../api/pre-register';

export const usePreRegister = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const toast = useToast();
  
  const formIsValid = email && email.includes('@');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);
    setErrorMessage("");
    setSuccess(false);

    if (!email) {
      setErrorMessage("Por favor, informe seu e-mail");
      setLoading(false);
      return false;
    }

    try {
      const response = await preRegister(email);
      if (response.statusCode === 200 || response.statusCode === 201) {
        setSuccess(true);
        toast.success(response.message || "E-mail de registro enviado com sucesso!");
        return true;
      } else {
        throw new Error(response.message || "Erro ao enviar e-mail de registro");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao enviar e-mail de registro";
      setErrorMessage(errorMessage);
      toast.error(errorMessage);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    loading,
    success,
    errorMessage,
    setErrorMessage,
    handleSubmit,
    formIsValid,
  };
};
