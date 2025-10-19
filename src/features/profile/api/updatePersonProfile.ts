import api from "@/services/api";
import { PersonProfile } from "../models/PersonProfile";
import { useTranslation } from "react-i18next";

export const updatePersonProfile = async (profileData: Partial<PersonProfile>) => {
    const { t } = useTranslation();
    try {
        const response = await api.put("/person/profile", profileData);
        if (response.status > 300) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || t("profile.error_title"));
        }
    } catch (error: any) {
        throw new Error(error.message || t("profile.error_title"));
    }
};