import { CompanyProfile } from "../models/company-profile";
import { useState } from "react";
import { useEffect } from "react";

export const useCompanyProfileForm = (props: { profile?: CompanyProfile, onUpdate: (data: Partial<CompanyProfile>) => Promise<boolean> }) => {

    const { profile, onUpdate } = props;

    const [formData, setFormData] = useState<Partial<CompanyProfile>>({
      companyName: '',
      businessName: '',
      cnpj: '',
      birthday: '',
      legalNature: '',
      companyDescription: '',
      logoImage: '',
      companyImages: [],
      tagId: [],
      partners: [],
      contacts: [],
      addresses: [
        {
          type: '',
          street: '',
          number: '',
          complement: '',
          city: '',
          state: ''
        }
      ],
      bankDatas: [
        {
          name: '',
          branch: '',
          account: '',
          accountType: ''
        }
      ],
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
  
    const handleBankDataChange = (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        bankDatas: prev.bankDatas?.map((bankData, i) =>
          i === index ? { ...bankData, [field]: value } : bankData
        ) || []
      }));
    };
  
    const handleContactChange = (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        contacts: prev.contacts?.map((contact, i) =>
          i === index ? { ...contact, [field]: value } : contact
        ) || []
      }));
    };
  
    const addContact = () => {
      setFormData(prev => ({
        ...prev,
        contacts: [...(prev.contacts || []), {
          type: '',
          value: '',
          complement: ''
        }]
      }));
    };
  
    const removeContact = (index: number) => {
      setFormData(prev => ({
        ...prev,
        contacts: prev.contacts?.filter((_, i) => i !== index) || []
      }));
    };
  
    const handlePartnerChange = (index: number, field: string, value: string) => {
      setFormData(prev => ({
        ...prev,
        partners: prev.partners?.map((partner, i) =>
          i === index ? { ...partner, [field]: value } : partner
        ) || []
      }));
    };
  
    const addPartner = () => {
      setFormData(prev => ({
        ...prev,
        partners: [...(prev.partners || []), {
          personId: ''
        }]
      }));
    };
  
    const removePartner = (index: number) => {
      setFormData(prev => ({
        ...prev,
        partners: prev.partners?.filter((_, i) => i !== index) || []
      }));
    };
  
    const handleCompanyImageChange = (index: number, value: string) => {
      setFormData(prev => ({
        ...prev,
        companyImages: prev.companyImages?.map((image, i) =>
          i === index ? value : image
        ) || []
      }));
    };
  
    const addCompanyImage = () => {
      setFormData(prev => ({
        ...prev,
        companyImages: [...(prev.companyImages || []), '']
      }));
    };
  
    const removeCompanyImage = (index: number) => {
      setFormData(prev => ({
        ...prev,
        companyImages: prev.companyImages?.filter((_, i) => i !== index) || []
      }));
    };

    const handleAddressChange = (field: string, value: string) => {
      const updatedAddresses = [...(formData.addresses || [])];
      if (updatedAddresses[0]) {
        updatedAddresses[0] = { ...updatedAddresses[0], [field]: value };
      } else {
        updatedAddresses[0] = { [field]: value };
      }
      setFormData(prev => ({
        ...prev,
        addresses: updatedAddresses
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
          day: new Date().getDate(),
          month: new Date().getMonth() + 1,
          year: new Date().getFullYear()
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
      handleBankDataChange,
      handleContactChange,
      addContact,
      removeContact,
      handlePartnerChange,
      addPartner,
      removePartner,
      handleCompanyImageChange,
      addCompanyImage,
      removeCompanyImage,
      handleRelatedFileChange,
      addRelatedFile,
      removeRelatedFile,
      handleSubmit,
      handleAddressChange,
    };
};