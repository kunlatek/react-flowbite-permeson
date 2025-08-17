import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, Spinner } from 'flowbite-react';
import KuInput from '@/components/form/KuInput';
import KuSelect from '@/components/form/KuSelect';
import KuButton from '@/components/form/KuButton';
import type { IPersonProfile } from '@/models/profile';

interface PersonProfileTabProps {
  profile: IPersonProfile | null;
  loading: boolean;
  onUpdate: (data: Partial<IPersonProfile>) => Promise<boolean>;
}

export default function PersonProfileTab({ profile, loading, onUpdate }: PersonProfileTabProps) {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<IPersonProfile>>({
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
    phoneNumberOne: '',
    phoneNumberTwo: '',
    emailOne: '',
    emailTwo: '',
    linkedin: '',
    instagram: '',
    facebook: '',
    addressOneCepBrasilApi: '',
    addressOneType: '',
    addressOneStreet: '',
    addressOneNumber: '',
    addressOneCity: '',
    addressOneState: '',
    addressTwoCepBrasilApi: '',
    addressTwoType: '',
    addressTwoStreet: '',
    addressTwoNumber: '',
    addressTwoCity: '',
    addressTwoState: '',
    personEducation: '',
    personLanguages: 0,
    bankDataOne: {
      bankName: '',
      bankBranch: '',
      bankAccount: '',
      bankAccountType: ''
    },
    bankDataTwo: {
      bankName: '',
      bankBranch: '',
      bankAccount: '',
      bankAccountType: ''
    }
  });

  // Update formData when profile changes
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

  const handleBankDataChange = (bankNumber: 'One' | 'Two', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [`bankData${bankNumber}`]: {
        ...(prev[`bankData${bankNumber}` as keyof IPersonProfile] as any),
        [field]: value
      }
    }));
  };

  // Array handling functions
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
        jobId: '',
        jobStartDateMonth: 1,
        jobStartDateYear: new Date().getFullYear(),
        jobFinishDateMonth: 1,
        jobFinishDateYear: new Date().getFullYear(),
        jobDescription: ''
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
      personEducations: prev.personEducations?.map((education, i) => 
        i === index ? { ...education, [field]: value } : education
      ) || []
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      personEducations: [...(prev.personEducations || []), {
        personEducationCourse: '',
        personEducationInstitution: '',
        personEducationStartDate: '',
        personEducationFinishDate: '',
        personEducationDescription: '',
        personEducationCertificateFile: ''
      }]
    }));
  };

  const removeEducation = (index: number) => {
    setFormData(prev => ({
      ...prev,
      personEducations: prev.personEducations?.filter((_, i) => i !== index) || []
    }));
  };

  const handleCourseChange = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      personCourses: prev.personCourses?.map((course, i) => 
        i === index ? { ...course, [field]: value } : course
      ) || []
    }));
  };

  const addCourse = () => {
    setFormData(prev => ({
      ...prev,
      personCourses: [...(prev.personCourses || []), {
        personCourseName: '',
        personCourseInstitution: '',
        personCourseStartDate: '',
        personCourseFinishDate: '',
        personCourseCertificateFile: ''
      }]
    }));
  };

  const removeCourse = (index: number) => {
    setFormData(prev => ({
      ...prev,
      personCourses: prev.personCourses?.filter((_, i) => i !== index) || []
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
        filesDescription: '',
        relatedFilesFiles: '',
        relatedFilesDateDay: new Date().getDate(),
        relatedFilesDateMonth: new Date().getMonth() + 1,
        relatedFilesDateYear: new Date().getFullYear()
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

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          {t("profile.person_not_found")}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Personal Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.person.personal_info")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="personName"
            type="input"
            dataType="text"
            label={t("profile.person.name")}
            value={formData.personName || ''}
            onChange={(e) => handleInputChange('personName', e.target.value)}
            isRequired={true}
          />
          <KuInput
            name="personNickname"
            type="input"
            dataType="text"
            label={t("profile.person.nickname")}
            value={formData.personNickname || ''}
            onChange={(e) => handleInputChange('personNickname', e.target.value)}
          />
          <KuSelect
            name="gender"
            type="select"
            dataType="text"
            label={t("profile.person.gender")}
            value={formData.gender || ''}
            onChange={(name, value) => handleInputChange(name, value)}
            options={[
              { value: 'Male', label: t("profile.person.gender_male") },
              { value: 'Female', label: t("profile.person.gender_female") },
              { value: 'Other', label: t("profile.person.gender_other") }
            ]}
          />
          <KuInput
            name="birthday"
            type="input"
            dataType="date"
            label={t("profile.person.birthday")}
            value={formData.birthday || ''}
            onChange={(e) => handleInputChange('birthday', e.target.value)}
          />
          <KuSelect
            name="maritalStatus"
            type="select"
            dataType="text"
            label={t("profile.person.marital_status")}
            value={formData.maritalStatus || ''}
            onChange={(name, value) => handleInputChange(name, value)}
            options={[
              { value: 'Single', label: t("profile.person.marital_single") },
              { value: 'Married', label: t("profile.person.marital_married") },
              { value: 'Divorced', label: t("profile.person.marital_divorced") },
              { value: 'Widowed', label: t("profile.person.marital_widowed") }
            ]}
          />
          <KuInput
            name="motherName"
            type="input"
            dataType="text"
            label={t("profile.person.mother_name")}
            value={formData.motherName || ''}
            onChange={(e) => handleInputChange('motherName', e.target.value)}
          />
        </div>
      </Card>

      {/* Contact Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.person.contact_info")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="phoneNumberOne"
            type="input"
            dataType="text"
            label={t("profile.person.phone_primary")}
            value={formData.phoneNumberOne || ''}
            onChange={(e) => handleInputChange('phoneNumberOne', e.target.value)}
          />
          <KuInput
            name="phoneNumberTwo"
            type="input"
            dataType="text"
            label={t("profile.person.phone_secondary")}
            value={formData.phoneNumberTwo || ''}
            onChange={(e) => handleInputChange('phoneNumberTwo', e.target.value)}
          />
          <KuInput
            name="emailOne"
            type="input"
            dataType="email"
            label={t("profile.person.email_primary")}
            value={formData.emailOne || ''}
            onChange={(e) => handleInputChange('emailOne', e.target.value)}
          />
          <KuInput
            name="emailTwo"
            type="input"
            dataType="email"
            label={t("profile.person.email_secondary")}
            value={formData.emailTwo || ''}
            onChange={(e) => handleInputChange('emailTwo', e.target.value)}
          />
        </div>
      </Card>

      {/* Social Media */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.person.social_media")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <KuInput
            name="linkedin"
            type="input"
            dataType="text"
            label="LinkedIn"
            value={formData.linkedin || ''}
            onChange={(e) => handleInputChange('linkedin', e.target.value)}
          />
          <KuInput
            name="instagram"
            type="input"
            dataType="text"
            label="Instagram"
            value={formData.instagram || ''}
            onChange={(e) => handleInputChange('instagram', e.target.value)}
          />
          <KuInput
            name="facebook"
            type="input"
            dataType="text"
            label="Facebook"
            value={formData.facebook || ''}
            onChange={(e) => handleInputChange('facebook', e.target.value)}
          />
        </div>
      </Card>

      {/* Primary Address */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.person.primary_address")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <KuInput
            name="addressOneCepBrasilApi"
            type="input"
            dataType="text"
            label={t("profile.person.cep")}
            value={formData.addressOneCepBrasilApi || ''}
            onChange={(e) => handleInputChange('addressOneCepBrasilApi', e.target.value)}
          />
          <KuSelect
            name="addressOneType"
            type="select"
            dataType="text"
            label={t("profile.person.address_type")}
            value={formData.addressOneType || ''}
            onChange={(name, value) => handleInputChange(name, value)}
            options={[
              { value: 'residential', label: t("profile.person.address_residential") },
              { value: 'commercial', label: t("profile.person.address_commercial") }
            ]}
          />
          <KuInput
            name="addressOneStreet"
            type="input"
            dataType="text"
            label={t("profile.person.street")}
            value={formData.addressOneStreet || ''}
            onChange={(e) => handleInputChange('addressOneStreet', e.target.value)}
          />
          <KuInput
            name="addressOneNumber"
            type="input"
            dataType="text"
            label={t("profile.person.number")}
            value={formData.addressOneNumber || ''}
            onChange={(e) => handleInputChange('addressOneNumber', e.target.value)}
          />
          <KuInput
            name="addressOneCity"
            type="input"
            dataType="text"
            label={t("profile.person.city")}
            value={formData.addressOneCity || ''}
            onChange={(e) => handleInputChange('addressOneCity', e.target.value)}
          />
          <KuInput
            name="addressOneState"
            type="input"
            dataType="text"
            label={t("profile.person.state")}
            value={formData.addressOneState || ''}
            onChange={(e) => handleInputChange('addressOneState', e.target.value)}
          />
        </div>
      </Card>

      {/* Bank Information */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {t("profile.person.bank_info")}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Primary Bank */}
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t("profile.person.primary_bank")}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <KuInput
                name="bankDataOne.bankName"
                type="input"
                dataType="text"
                label={t("profile.person.bank_name")}
                value={formData.bankDataOne?.bankName || ''}
                onChange={(e) => handleBankDataChange('One', 'bankName', e.target.value)}
              />
              <KuInput
                name="bankDataOne.bankBranch"
                type="input"
                dataType="text"
                label={t("profile.person.bank_branch")}
                value={formData.bankDataOne?.bankBranch || ''}
                onChange={(e) => handleBankDataChange('One', 'bankBranch', e.target.value)}
              />
              <KuInput
                name="bankDataOne.bankAccount"
                type="input"
                dataType="text"
                label={t("profile.person.bank_account")}
                value={formData.bankDataOne?.bankAccount || ''}
                onChange={(e) => handleBankDataChange('One', 'bankAccount', e.target.value)}
              />
              <KuSelect
                name="bankDataOne.bankAccountType"
                type="select"
                dataType="text"
                label={t("profile.person.bank_account_type")}
                value={formData.bankDataOne?.bankAccountType || ''}
                onChange={(name, value) => handleBankDataChange('One', 'bankAccountType', String(value))}
                options={[
                  { value: 'current', label: t("profile.person.bank_current") },
                  { value: 'savings', label: t("profile.person.bank_savings") }
                ]}
              />
            </div>
          </div>

          {/* Secondary Bank */}
          <div>
            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">
              {t("profile.person.secondary_bank")}
            </h4>
            <div className="grid grid-cols-1 gap-4">
              <KuInput
                name="bankDataTwo.bankName"
                type="input"
                dataType="text"
                label={t("profile.person.bank_name")}
                value={formData.bankDataTwo?.bankName || ''}
                onChange={(e) => handleBankDataChange('Two', 'bankName', e.target.value)}
              />
              <KuInput
                name="bankDataTwo.bankBranch"
                type="input"
                dataType="text"
                label={t("profile.person.bank_branch")}
                value={formData.bankDataTwo?.bankBranch || ''}
                onChange={(e) => handleBankDataChange('Two', 'bankBranch', e.target.value)}
              />
              <KuInput
                name="bankDataTwo.bankAccount"
                type="input"
                dataType="text"
                label={t("profile.person.bank_account")}
                value={formData.bankDataTwo?.bankAccount || ''}
                onChange={(e) => handleBankDataChange('Two', 'bankAccount', e.target.value)}
              />
              <KuSelect
                name="bankDataTwo.bankAccountType"
                type="select"
                dataType="text"
                label={t("profile.person.bank_account_type")}
                value={formData.bankDataTwo?.bankAccountType || ''}
                onChange={(name, value) => handleBankDataChange('Two', 'bankAccountType', String(value))}
                options={[
                  { value: 'current', label: t("profile.person.bank_current") },
                  { value: 'savings', label: t("profile.person.bank_savings") }
                ]}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Professions */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("profile.person.professions")}
          </h3>
          <KuButton
            id="add-profession"
            type="button"
            actionType="button"
            variant="secondary"
            size="sm"
            label={t("profile.person.add_profession")}
            onClick={addProfession}
          />
        </div>
        
        {formData.professions?.map((profession, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                {t("profile.person.profession")} {index + 1}
              </h4>
              <KuButton
                id={`remove-profession-${index}`}
                type="button"
                actionType="button"
                variant="danger"
                size="sm"
                label={t("profile.person.remove_profession")}
                onClick={() => removeProfession(index)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KuInput
                name={`jobId-${index}`}
                type="input"
                dataType="text"
                label={t("profile.person.job_id")}
                value={profession.jobId}
                onChange={(e) => handleProfessionChange(index, 'jobId', e.target.value)}
              />
              <KuInput
                name={`jobDescription-${index}`}
                type="input"
                dataType="text"
                label={t("profile.person.job_description")}
                value={profession.jobDescription}
                onChange={(e) => handleProfessionChange(index, 'jobDescription', e.target.value)}
              />
              <KuInput
                name={`jobStartDateMonth-${index}`}
                type="input"
                dataType="number"
                label={t("profile.person.job_start_month")}
                value={profession.jobStartDateMonth}
                onChange={(e) => handleProfessionChange(index, 'jobStartDateMonth', e.target.value)}
              />
              <KuInput
                name={`jobStartDateYear-${index}`}
                type="input"
                dataType="number"
                label={t("profile.person.job_start_year")}
                value={profession.jobStartDateYear}
                onChange={(e) => handleProfessionChange(index, 'jobStartDateYear', e.target.value)}
              />
              <KuInput
                name={`jobFinishDateMonth-${index}`}
                type="input"
                dataType="number"
                label={t("profile.person.job_finish_month")}
                value={profession.jobFinishDateMonth}
                onChange={(e) => handleProfessionChange(index, 'jobFinishDateMonth', e.target.value)}
              />
              <KuInput
                name={`jobFinishDateYear-${index}`}
                type="input"
                dataType="number"
                label={t("profile.person.job_finish_year")}
                value={profession.jobFinishDateYear}
                onChange={(e) => handleProfessionChange(index, 'jobFinishDateYear', e.target.value)}
              />
            </div>
          </div>
        ))}
      </Card>

      {/* Education */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("profile.person.education")}
          </h3>
          <KuButton
            id="add-education"
            type="button"
            actionType="button"
            variant="secondary"
            size="sm"
            label={t("profile.person.add_education")}
            onClick={addEducation}
          />
        </div>
        
        {formData.personEducations?.map((education, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                {t("profile.person.education_item")} {index + 1}
              </h4>
              <KuButton
                id={`remove-education-${index}`}
                type="button"
                actionType="button"
                variant="danger"
                size="sm"
                label={t("profile.person.remove_education")}
                onClick={() => removeEducation(index)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KuInput
                name={`personEducationCourse-${index}`}
                type="input"
                dataType="text"
                label={t("profile.person.education_course")}
                value={education.personEducationCourse}
                onChange={(e) => handleEducationChange(index, 'personEducationCourse', e.target.value)}
              />
              <KuInput
                name={`personEducationInstitution-${index}`}
                type="input"
                dataType="text"
                label={t("profile.person.education_institution")}
                value={education.personEducationInstitution}
                onChange={(e) => handleEducationChange(index, 'personEducationInstitution', e.target.value)}
              />
              <KuInput
                name={`personEducationStartDate-${index}`}
                type="input"
                dataType="date"
                label={t("profile.person.education_start_date")}
                value={education.personEducationStartDate}
                onChange={(e) => handleEducationChange(index, 'personEducationStartDate', e.target.value)}
              />
              <KuInput
                name={`personEducationFinishDate-${index}`}
                type="input"
                dataType="date"
                label={t("profile.person.education_finish_date")}
                value={education.personEducationFinishDate}
                onChange={(e) => handleEducationChange(index, 'personEducationFinishDate', e.target.value)}
              />
              <div className="md:col-span-2">
                <KuInput
                  name={`personEducationDescription-${index}`}
                  type="input"
                  dataType="text"
                  label={t("profile.person.education_description")}
                  value={education.personEducationDescription}
                  onChange={(e) => handleEducationChange(index, 'personEducationDescription', e.target.value)}
                />
              </div>
              <KuInput
                name={`personEducationCertificateFile-${index}`}
                type="input"
                dataType="text"
                label={t("profile.person.education_certificate")}
                value={education.personEducationCertificateFile}
                onChange={(e) => handleEducationChange(index, 'personEducationCertificateFile', e.target.value)}
              />
            </div>
          </div>
        ))}
      </Card>

      {/* Courses */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("profile.person.courses")}
          </h3>
          <KuButton
            id="add-course"
            type="button"
            actionType="button"
            variant="secondary"
            size="sm"
            label={t("profile.person.add_course")}
            onClick={addCourse}
          />
        </div>
        
        {formData.personCourses?.map((course, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                {t("profile.person.course")} {index + 1}
              </h4>
              <KuButton
                id={`remove-course-${index}`}
                type="button"
                actionType="button"
                variant="danger"
                size="sm"
                label={t("profile.person.remove_course")}
                onClick={() => removeCourse(index)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KuInput
                name={`personCourseName-${index}`}
                type="input"
                dataType="text"
                label={t("profile.person.course_name")}
                value={course.personCourseName}
                onChange={(e) => handleCourseChange(index, 'personCourseName', e.target.value)}
              />
              <KuInput
                name={`personCourseInstitution-${index}`}
                type="input"
                dataType="text"
                label={t("profile.person.course_institution")}
                value={course.personCourseInstitution}
                onChange={(e) => handleCourseChange(index, 'personCourseInstitution', e.target.value)}
              />
              <KuInput
                name={`personCourseStartDate-${index}`}
                type="input"
                dataType="date"
                label={t("profile.person.course_start_date")}
                value={course.personCourseStartDate}
                onChange={(e) => handleCourseChange(index, 'personCourseStartDate', e.target.value)}
              />
              <KuInput
                name={`personCourseFinishDate-${index}`}
                type="input"
                dataType="date"
                label={t("profile.person.course_finish_date")}
                value={course.personCourseFinishDate}
                onChange={(e) => handleCourseChange(index, 'personCourseFinishDate', e.target.value)}
              />
              <KuInput
                name={`personCourseCertificateFile-${index}`}
                type="input"
                dataType="text"
                label={t("profile.person.course_certificate")}
                value={course.personCourseCertificateFile}
                onChange={(e) => handleCourseChange(index, 'personCourseCertificateFile', e.target.value)}
              />
            </div>
          </div>
        ))}
      </Card>

      {/* Related Files */}
      <Card>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {t("profile.person.related_files")}
          </h3>
          <KuButton
            id="add-related-file"
            type="button"
            actionType="button"
            variant="secondary"
            size="sm"
            label={t("profile.person.add_related_file")}
            onClick={addRelatedFile}
          />
        </div>
        
        {formData.relatedFiles?.map((file, index) => (
          <div key={index} className="border rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                {t("profile.person.related_file")} {index + 1}
              </h4>
              <KuButton
                id={`remove-related-file-${index}`}
                type="button"
                actionType="button"
                variant="danger"
                size="sm"
                label={t("profile.person.remove_related_file")}
                onClick={() => removeRelatedFile(index)}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KuInput
                name={`filesDescription-${index}`}
                type="input"
                dataType="text"
                label={t("profile.person.file_description")}
                value={file.filesDescription}
                onChange={(e) => handleRelatedFileChange(index, 'filesDescription', e.target.value)}
              />
              <KuInput
                name={`relatedFilesFiles-${index}`}
                type="input"
                dataType="text"
                label={t("profile.person.file_path")}
                value={file.relatedFilesFiles}
                onChange={(e) => handleRelatedFileChange(index, 'relatedFilesFiles', e.target.value)}
              />
              <KuInput
                name={`relatedFilesDateDay-${index}`}
                type="input"
                dataType="number"
                label={t("profile.person.file_date_day")}
                value={file.relatedFilesDateDay}
                onChange={(e) => handleRelatedFileChange(index, 'relatedFilesDateDay', parseInt(e.target.value))}
              />
              <KuInput
                name={`relatedFilesDateMonth-${index}`}
                type="input"
                dataType="number"
                label={t("profile.person.file_date_month")}
                value={file.relatedFilesDateMonth}
                onChange={(e) => handleRelatedFileChange(index, 'relatedFilesDateMonth', parseInt(e.target.value))}
              />
              <KuInput
                name={`relatedFilesDateYear-${index}`}
                type="input"
                dataType="number"
                label={t("profile.person.file_date_year")}
                value={file.relatedFilesDateYear}
                onChange={(e) => handleRelatedFileChange(index, 'relatedFilesDateYear', parseInt(e.target.value))}
              />
            </div>
          </div>
        ))}
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <KuButton
          id="update-person-profile"
          type="button"
          actionType="submit"
          isDisabled={loading}
          label={loading ? t("profile.updating") : t("profile.update")}
          customClass="flex items-center"
        >
          {loading ? (
            <Spinner size="sm" className="mr-2" />
          ) : null}
        </KuButton>
      </div>
    </form>
  );
}
