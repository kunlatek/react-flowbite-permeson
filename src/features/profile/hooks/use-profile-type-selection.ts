import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

export const useProfileTypeSelection = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedType, setSelectedType] = useState<'person' | 'company' | null>(null);
  
    const handleTypeSelection = (type: 'person' | 'company') => {
      setSelectedType(type);
    };
  
    const handleContinue = () => {
      if (selectedType) {
        navigate(`/profile/setup?type=${selectedType}`);
      }
    };

  return { selectedType, handleTypeSelection, handleContinue };
};