import api from "@/services/api";

export const fetchPersonProfile = async () => {
    const response = await api.get("/profiles/person");
    if (response.status === 200) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || "Erro ao buscar perfil do usuário");
    }
};