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
  const response = await api.post("/profiles/person", profileData);
  return response.data;
};

const getPersonProfile = async (): Promise<IPersonProfile> => {
  const response = await api.get("/profiles/person");
  return response.data.data;
};

const getPersonProfileById = async (id: string): Promise<IPersonProfile> => {
  const response = await api.get(`/profiles/person/${id}`);
  return response.data.data;
};

const updatePersonProfile = async (profileData: Partial<IPersonProfile>) => {
  const response = await api.put("/profiles/person", profileData);
  return response.data;
};

const updatePersonProfileById = async (
  id: string,
  profileData: Partial<IPersonProfile>
) => {
  const response = await api.put(`/profiles/person/${id}`, profileData);
  return response.data;
};

// --- Company Profile Methods ---
const createCompanyProfile = async (profileData: Partial<ICompanyProfile>) => {
  const response = await api.post("/profiles/company", profileData);
  return response.data;
};

const getCompanyProfile = async (): Promise<ICompanyProfile> => {
  const response = await api.get("/profiles/company");
  return response.data.data;
};

const getCompanyProfileById = async (id: string): Promise<ICompanyProfile> => {
  const response = await api.get(`/profiles/company/${id}`);
  return response.data.data;
};

const updateCompanyProfile = async (profileData: Partial<ICompanyProfile>) => {
  const response = await api.put("/profiles/company", profileData);
  return response.data;
};

const updateCompanyProfileById = async (
  id: string,
  profileData: Partial<ICompanyProfile>
) => {
  const response = await api.put(`/profiles/company/${id}`, profileData);
  return response.data;
};

export const profileService = {
  checkUserProfiles,
  createPersonProfile,
  getPersonProfile,
  getPersonProfileById,
  updatePersonProfile,
  updatePersonProfileById,
  createCompanyProfile,
  getCompanyProfile,
  getCompanyProfileById,
  updateCompanyProfile,
  updateCompanyProfileById,
};
