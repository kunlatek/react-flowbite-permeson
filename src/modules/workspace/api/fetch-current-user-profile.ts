import api from "@/services/api";

export const fetchCurrentUserProfile = async (): Promise<{ userId: string; type: 'person' | 'company' } | null> => {
  try {
    const personResponse = await api.get('/profiles/person');
    
    if (personResponse.data?.data?.userId) {
      return {
        userId: personResponse.data.data.userId,
        type: 'person'
      };
    }
  } catch (err) {
    console.error('getCurrentUserProfile - person not found, trying company');
  }
  
  try {
    const companyResponse = await api.get('/profiles/company');
    
    if (companyResponse.data?.data?.userId) {
      return {
        userId: companyResponse.data.data.userId,
        type: 'company'
      };
    }
  } catch (err) {
    console.error('getCurrentUserProfile - company not found');
  }
  
  return null;
};