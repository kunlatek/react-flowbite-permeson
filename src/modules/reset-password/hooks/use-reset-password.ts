import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useParams, useNavigate } from "react-router-dom";
import { resetPassword } from "../api/reset-password";

export const useResetPassword = () => {
    const { token } = useParams<{ token: string }>();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const toast = useToast();

    // Validation helpers
    const passwordLength = password.length >= 8;
    const passwordsMatch = password === confirmPassword;
    const formIsValid =
        password &&
        confirmPassword &&
        passwordLength &&
        passwordsMatch;


    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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
            const response = await resetPassword(token || "", password);
            if (response.statusCode === 200) {
                setSuccess(true);
                toast.success(response.message || "Senha redefinida com sucesso!");
                setTimeout(() => {
                    navigate("/auth/login");
                }, 2000);
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
        formIsValid,
        passwordLength,
        passwordsMatch,
        token,
    };
};