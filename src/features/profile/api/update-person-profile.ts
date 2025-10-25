import api from "@/services/api";
import { PersonProfile } from "../models/person-profile";

export const updatePersonProfile = async (profileData: Partial<PersonProfile>) => {
    const response = await api.put("/profiles/person", profileData);
    if (response.status < 300) {
        return response.data.data;
    } else {
        throw new Error(response.data.message || "Erro ao atualizar perfil do usuário");
    }
};