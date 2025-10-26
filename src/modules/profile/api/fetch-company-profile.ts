import api from "@/services/api";

export const fetchCompanyProfile = async () => {
        const response = await api.get("/profiles/company");
        if (response.status === 200) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || "Erro ao buscar perfil da empresa");
    }
};