import api from "./api";
import type {
  IPersonProfile,
  ICompanyProfile,
} from "@/models/profile";

interface ProfileCheckResponse {
  person: boolean;
  company: boolean;
}

interface ProfileStatus {
  hasPerson: boolean;
  hasCompany: boolean;
}

const checkUserProfiles = async (): Promise<ProfileStatus> => {
  const response = await api.get<ProfileCheckResponse>("/users/has-profile");
  return {
    hasPerson: response.data.person,
    hasCompany: response.data.company,
  };
};

// --- Person Profile Methods ---
const createPersonProfile = async (profileData: Partial<IPersonProfile>) => {
  const response = await api.post("/person-profiles", profileData);
  return response.data;
};

const getPersonProfileById = async (id: string): Promise<IPersonProfile> => {
  const response = await api.get(`/person-profiles/${id}`);
  return response.data;
};

const updatePersonProfile = async (
  id: string,
  profileData: Partial<IPersonProfile>
) => {
  const response = await api.patch(`/person-profiles/${id}`, profileData);
  return response.data;
};

// --- Company Profile Methods ---
const createCompanyProfile = async (profileData: Partial<ICompanyProfile>) => {
  const response = await api.post("/company-profiles", profileData);
  return response.data;
};

const getCompanyProfileById = async (id: string): Promise<ICompanyProfile> => {
  const response = await api.get(`/company-profiles/${id}`);
  return response.data;
};

const updateCompanyProfile = async (
  id: string,
  profileData: Partial<ICompanyProfile>
) => {
  const response = await api.patch(`/company-profiles/${id}`, profileData);
  return response.data;
};

export const profileService = {
  checkUserProfiles,
  createPersonProfile,
  getPersonProfileById,
  updatePersonProfile,
  createCompanyProfile,
  getCompanyProfileById,
  updateCompanyProfile,
};
