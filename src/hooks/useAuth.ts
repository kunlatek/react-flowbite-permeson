import { useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '@/contexts/AuthContext';
import type { AuthContextType } from '@/models/auth';
import { useToast } from './useToast';
import axios from 'axios';
import { login, presignup, signup, forgotPassword, resetPassword } from '@/api/auth';
import { useNavigate } from 'react-router-dom';

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);
    
    if (!email || !password) {
      toast.error("Por favor, preencha todos os campos");
      setLoading(false);
      return false;
    }

    try {
      const response = await login(email, password);
      toast.success(response.message || "Login realizado com sucesso!");
      setSuccess(true);
      return true;
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Erro ao fazer login";
        toast.error(errorMsg);
        setErrorMessage(errorMsg);
      } else {
        toast.error("Erro ao fazer login.");
        setErrorMessage("Erro ao fazer login.");
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    handleSubmit, 
    loading, 
    success, 
    errorMessage, 
    setErrorMessage 
  };
};

export const useSignup = (token?: string) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const toast = useToast();
  const { setSession } = useAuth();
  
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);
    
    // Validation
    if (!email || !password || !confirmPassword) {
      toast.error("Por favor, preencha todos os campos");
      setLoading(false);
      return false;
    }

    if (password.length < 8) {
      toast.error("A senha deve ter pelo menos 8 caracteres");
      setLoading(false);
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("As senhas não coincidem");
      setLoading(false);
      return false;
    }

    try {
      if (!token) {
        throw new Error("Token de registro é obrigatório");
      }
      const response = await signup(email, password, token);
      
      if (response.statusCode === 200 && response.data?.access_token) {
        setSession(response.data.access_token, email);
        toast.success(response.message || "Conta criada e login realizado com sucesso!");
        navigate('/profile/type-selection');
        return true;
      } else {
        throw new Error(response.message || 'Erro no login');
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const errorMsg = err.response?.data?.message || "Erro ao fazer cadastro";
        toast.error(errorMsg);
        setErrorMessage(errorMsg);
      } else {
        toast.error("Erro ao fazer cadastro.");
        setErrorMessage("Erro ao fazer cadastro.");
      }
      setLoading(false);
      return false;
    }
  };

  return { 
    email, 
    setEmail, 
    password, 
    setPassword, 
    confirmPassword, 
    setConfirmPassword,
    handleSubmit, 
    loading, 
    success, 
    errorMessage, 
    setErrorMessage 
  };
};

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

export const useResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const toast = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>, token: string) => {
    event.preventDefault();
    event.stopPropagation();
    setLoading(true);
    setErrorMessage("");
    setSuccess(false);

    if (!password || !confirmPassword) {
      setErrorMessage("Por favor, preencha todos os campos");
      setLoading(false);
      return false;
    }

    if (password.length < 8) {
      setErrorMessage("A senha deve ter pelo menos 8 caracteres");
      setLoading(false);
      return false;
    }

    if (password !== confirmPassword) {
      setErrorMessage("As senhas não coincidem");
      setLoading(false);
      return false;
    }

    try {
      const response = await resetPassword(token, password);
      if (response.statusCode === 200) {
        setSuccess(true);
        toast.success(response.message || "Senha redefinida com sucesso!");
        return true;
      } else {
        throw new Error(response.message || "Erro ao redefinir senha");
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "Erro ao redefinir senha";
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
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    success,
    errorMessage,
    setErrorMessage,
    handleSubmit,
  };
};

export const usePreSignup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const toast = useToast();

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
      const response = await presignup(email);
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
  };
};
