import api from "@/services/api";

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post("/auth/login", { email, password });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = () => {};

export const presignup = async (email: string) => {
    try {
        const response = await api.post("/auth/presignup", { email });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const signup = async (email: string, password: string, token: string) => {
    try {
        const response = await api.post("/auth/signup", { email, password, token });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const forgotPassword = async (email: string) => {
    const response = await api.post("/auth/reset-password-request", { email });
    return response.data;
};

export const resetPassword = async (token: string, password: string) => {
    const response = await api.post("/auth/reset-password", {
        token,
        password,
    });
    return response.data;
};


export const switchRole = async (role: string) => {
    const response = await api.post("/auth/switch-role", { role });
    return response.data;
};