import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePersonProfile, useCompanyProfile } from ".";
import { PersonProfile, CompanyProfile } from "../models";

export const useCreateProfile = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const profileType = searchParams.get('type') as 'person' | 'company';

    const personProfile = usePersonProfile();
    const companyProfile = useCompanyProfile();

    const isLoading = personProfile.loading || companyProfile.loading;
    const hasError = personProfile.error || companyProfile.error;

    useEffect(() => {
        if (!profileType || !['person', 'company'].includes(profileType)) {
            navigate('/profile/type-selection');
        }
    }, [profileType, navigate]);

    const handleSaveAndContinue = async (data: Partial<PersonProfile> | Partial<CompanyProfile>) => {
        try {
            if (profileType === 'person') {
                await personProfile.updateProfile(data as Partial<PersonProfile>);
            } else if (profileType === 'company') {
                await companyProfile.updateProfile(data as Partial<CompanyProfile>);
            }
            navigate('/dashboard');
            return true;
        } catch (error) {
            return false;
        }
    };

    return { 
        isLoading, 
        hasError, 
        handleSaveAndContinue, 
        profileType, 
        personProfile, 
        companyProfile,
    };
};