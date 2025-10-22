import { PersonProfile } from "../models/person-profile";
import { useState } from "react";
import { useEffect } from "react";

export const usePersonProfileForm = (props: { profile?: PersonProfile, onUpdate: (data: Partial<PersonProfile>) => Promise<boolean> }) => {

    const { profile, onUpdate } = props;

    const [formData, setFormData] = useState<Partial<PersonProfile>>({
      personName: '',
      personNickname: '',
      gender: '',
      birthday: '',
      maritalStatus: '',
      motherName: '',
      personDescription: '',
      cpf: '',
      rg: '',
      rgIssuingAuthority: '',
      rgIssuanceDate: '',
      rgState: '',
      passport: '',
      passportIssuanceDate: '',
      passportExpirationDate: '',
      phoneNumbers: [],
      emails: [],
      linkedin: '',
      instagram: '',
      facebook: '',
      addresses: [],
      professions: [],
      educations: [],
      courses: [],
      languages: 0,
      bankDatas: [],
      relatedFiles: []
    });
  
    useEffect(() => {
      if (profile) {
        setFormData(profile);
      }
    }, [profile]);
  
    const handleInputChange = (field: string, value: any) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleEmailChange = (index: number, value: string) => {
      setFormData(prev => ({
        ...prev,
        emails: prev.emails?.map((email, i) =>
          i === index ? value : email
        ) || []
      }));
    };

    const addEmail = () => {
      setFormData(prev => ({
        ...prev,
        emails: [...(prev.emails || []), '']
      }));
    };

    const removeEmail = (index: number) => {
      setFormData(prev => ({
        ...prev,
        emails: prev.emails?.filter((_, i) => i !== index) || []
      }));
    };

    const handlePhoneChange = (index: number, value: string) => {
      setFormData(prev => ({
        ...prev,
        phoneNumbers: prev.phoneNumbers?.map((phone, i) =>
          i === index ? value : phone
        ) || []
      }));
    };

    const addPhone = () => {
      setFormData(prev => ({
        ...prev,
        phoneNumbers: [...(prev.phoneNumbers || []), '']
      }));
    };

    const removePhone = (index: number) => {
      setFormData(prev => ({
        ...prev,
        phoneNumbers: prev.phoneNumbers?.filter((_, i) => i !== index) || []
      }));
    };
  
    const handleBankDataChange = (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        bankDatas: prev.bankDatas?.map((bankData, i) =>
          i === index ? { ...bankData, [field]: value } : bankData
        ) || []
      }));
    };

    const addBankData = () => {
      setFormData(prev => ({
        ...prev,
        bankDatas: [...(prev.bankDatas || []), {
          name: '',
          branch: '',
          account: '',
          accountType: ''
        }]
      }));
    };

    const removeBankData = (index: number) => {
      setFormData(prev => ({
        ...prev,
        bankDatas: prev.bankDatas?.filter((_, i) => i !== index) || []
      }));
    };

    const handleAddressChange = (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        addresses: prev.addresses?.map((address, i) =>
          i === index ? { ...address, [field]: value } : address
        ) || []
      }));
    };

    const addAddress = () => {
      setFormData(prev => ({
        ...prev,
        addresses: [...(prev.addresses || []), {
          type: '',
          street: '',
          number: '',
          complement: '',
          city: '',
          state: '',
          cep: '',
          country: '',
          countryCode: ''
        }]
      }));
    };

    const removeAddress = (index: number) => {
      setFormData(prev => ({
        ...prev,
        addresses: prev.addresses?.filter((_, i) => i !== index) || []
      }));
    };
  
    const handleProfessionChange = (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        professions: prev.professions?.map((profession, i) =>
          i === index ? { ...profession, [field]: value } : profession
        ) || []
      }));
    };
  
    const addProfession = () => {
      setFormData(prev => ({
        ...prev,
        professions: [...(prev.professions || []), {
          startDateMonth: 1,
          startDateYear: new Date().getFullYear(),
          finishDateMonth: 1,
          finishDateYear: new Date().getFullYear(),
          description: ''
        }]
      }));
    };
  
    const removeProfession = (index: number) => {
      setFormData(prev => ({
        ...prev,
        professions: prev.professions?.filter((_, i) => i !== index) || []
      }));
    };
  
    const handleEducationChange = (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        educations: prev.educations?.map((education, i) =>
          i === index ? { ...education, [field]: value } : education
        ) || []
      }));
    };
  
    const addEducation = () => {
      setFormData(prev => ({
        ...prev,
        educations: [...(prev.educations || []), {
          course: '',
          institution: '',
          startDate: '',
          finishDate: '',
          description: '',
          certificateFile: ''
        }]
      }));
    };
  
    const removeEducation = (index: number) => {
      setFormData(prev => ({
        ...prev,
        educations: prev.educations?.filter((_, i) => i !== index) || []
      }));
    };
  
    const handleCourseChange = (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        courses: prev.courses?.map((course, i) =>
          i === index ? { ...course, [field]: value } : course
        ) || []
      }));
    };
  
    const addCourse = () => {
      setFormData(prev => ({
        ...prev,
        courses: [...(prev.courses || []), {
          name: '',
          institution: '',
          startDate: '',
          finishDate: '',
          certificateFile: ''
        }]
      }));
    };
  
    const removeCourse = (index: number) => {
      setFormData(prev => ({
        ...prev,
        courses: prev.courses?.filter((_, i) => i !== index) || []
      }));
    };
  
    const handleRelatedFileChange = (index: number, field: string, value: string | number) => {
      setFormData(prev => ({
        ...prev,
        relatedFiles: prev.relatedFiles?.map((file, i) =>
          i === index ? { ...file, [field]: value } : file
        ) || []
      }));
    };
  
    const addRelatedFile = () => {
      setFormData(prev => ({
        ...prev,
        relatedFiles: [...(prev.relatedFiles || []), {
          description: '',
          file: '',
          dateDay: new Date().getDate(),
          dateMonth: new Date().getMonth() + 1,
          dateYear: new Date().getFullYear()
        }]
      }));
    };
  
    const removeRelatedFile = (index: number) => {
      setFormData(prev => ({
        ...prev,
        relatedFiles: prev.relatedFiles?.filter((_, i) => i !== index) || []
      }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      await onUpdate(formData);
    };

    return {
      formData,
      handleInputChange,
      handleEmailChange,
      addEmail,
      removeEmail,
      handlePhoneChange,
      addPhone,
      removePhone,
      handleBankDataChange,
      addBankData,
      removeBankData,
      handleAddressChange,
      addAddress,
      removeAddress,
      handleProfessionChange,
      addProfession,
      removeProfession,
      handleEducationChange,
      addEducation,
      removeEducation,
      handleCourseChange,
      addCourse,
      removeCourse,
      handleRelatedFileChange,
      addRelatedFile,
      removeRelatedFile,
      handleSubmit,
    };
};
