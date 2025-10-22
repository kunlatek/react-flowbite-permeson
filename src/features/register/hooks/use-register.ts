import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/useToast";
import { register } from "../api/register";
import { useAuth } from "@/hooks/use-auth";
import axios from "axios";

export const useRegister = () => {
    const [searchParams] = useSearchParams();
    const [email, setEmail] = useState(searchParams.get('email') || '');
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [token] = useState(searchParams.get('token') || '');

    // Validation helpers
    const passwordLength = password.length >= 8;
    const passwordsMatch = password === confirmPassword;
    const formIsValid =
        email &&
        password &&
        confirmPassword &&
        passwordLength &&
        passwordsMatch;

    const [loading, setLoading] = useState(false);
    const [success,] = useState(false);
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
            const response = await register(email, password, token);

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
        setErrorMessage,
        formIsValid,
        passwordLength,
        passwordsMatch,
    };
};