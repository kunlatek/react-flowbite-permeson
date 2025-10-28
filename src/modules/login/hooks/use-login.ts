import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { login } from "../api/login";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';

export const useLogin = () => {
    const { setSession } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const navigate = useNavigate();

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
            setSession(response?.data?.access_token, email);
            toast.success(response.message || "Login realizado com sucesso!");
            setSuccess(true);
            setLoading(false);

            setTimeout(() => {
                navigate("/dashboard");
            }, 2000);
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
        setErrorMessage,
    };
};