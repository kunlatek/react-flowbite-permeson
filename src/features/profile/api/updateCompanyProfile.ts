import api from "@/services/api";
import { CompanyProfile } from "../models/CompanyProfile";
import { useTranslation } from "react-i18next";

export const updateCompanyProfile = async (profileData: Partial<CompanyProfile>) => {
    const { t } = useTranslation();
    try {
        const response = await api.put("/profiles/company", profileData);
        if (response.status > 300) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || t("profile.error_title"));
        }
    } catch (error: any) {
        throw new Error(error.message || t("profile.error_title"));
    }
};