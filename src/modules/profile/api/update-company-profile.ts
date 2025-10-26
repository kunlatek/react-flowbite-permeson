import api from "@/services/api";
import { CompanyProfile } from "../models/company-profile";

export const updateCompanyProfile = async (profileData: Partial<CompanyProfile>) => {
    const response = await api.put("/profiles/company", profileData);
    if (response.status < 300) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || "Erro ao atualizar perfil da empresa");
    }
};