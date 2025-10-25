import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { usePersonProfile, useCompanyProfile } from ".";
import { PersonProfile, CompanyProfile } from "../models";

export const useCreateProfile = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const profileType = searchParams.get('type') as 'person' | 'company';

    // Always call hooks, but only use the relevant one
    const personProfile = usePersonProfile();
    const companyProfile = useCompanyProfile();

    // Determine which profile to use based on type
    const activeProfile = profileType === 'person' ? personProfile : companyProfile;
    const isLoading = activeProfile.loading;
    const hasError = activeProfile.error;

    useEffect(() => {
        if (!profileType || !['person', 'company'].includes(profileType)) {
            navigate('/profile/type-selection');
        }
    }, [profileType, navigate]);

    const handleSaveAndContinue = async (data: Partial<PersonProfile> | Partial<CompanyProfile>) => {
        try {
            await activeProfile.updateProfile(data as any);
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
        activeProfile,
    };
};