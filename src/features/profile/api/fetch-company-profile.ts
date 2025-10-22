import api from "@/services/api";
import { useTranslation } from "react-i18next";

export const fetchCompanyProfile = async () => {
    const { t } = useTranslation();
    try {
        const response = await api.get("/person/company");
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error(response.data.message || t("profile.error_title"));
        }
    } catch (error: any) {
        throw new Error(error.message || t("profile.error_title"));
    }
};