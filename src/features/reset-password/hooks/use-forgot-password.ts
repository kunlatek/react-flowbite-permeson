import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { forgotPassword } from "../api/forgot-password";
import axios from "axios";

export const useForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
  
    const toast = useToast();
    
    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setLoading(true);
      
      if (!email) {
        toast.error("Por favor, informe seu email");
        setLoading(false);
        return false;
      }
  
      try {
        const response = await forgotPassword(email);
        toast.success(response.message || "Email de redefinição enviado com sucesso!");
        setSuccess(true);
        setLoading(false);
        return true;
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          const errorMsg = err.response?.data?.message || "Erro ao enviar email de redefinição";
          toast.error(errorMsg);
          setErrorMessage(errorMsg);
        } else {
          toast.error("Erro ao enviar email de redefinição.");
          setErrorMessage("Erro ao enviar email de redefinição.");
        }
        setLoading(false);
        return false;
      }
    };
  
    return { 
      email, 
      setEmail, 
      handleSubmit, 
      loading, 
      success, 
      errorMessage, 
      setErrorMessage 
    };
  };