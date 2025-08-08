import { useState } from "react";
import {
  KuInput,
  KuSelect,
  KuFile,
  KuFieldset,
  KuButton,
} from "@/components/form";
import { STATES } from "@/constants/states";
import {
  maritalStatusOptions,
  educationLevelOptions,
  languageOptions,
  addressTypeOptions,
  bankAccountTypeOptions,
} from "@/constants/options";
import { Textarea } from "flowbite-react";
import type { IPersonProfile, IBankData } from "@/models/profile";
import type { ISelectOption } from "@/models/form";
import KuTab from "@/components/form/KuTab";

interface PersonProfileFormProps {
  profile: Partial<IPersonProfile>;
  onProfileChange: (profile: Partial<IPersonProfile>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
  errors: Record<string, string>;
}

const tabs = [
  { id: "main", title: "Dados Principais" },
  { id: "documents", title: "Documentos" },
  { id: "addresses", title: "Endereços" },
  { id: "education", title: "Formação" },
  { id: "banking", title: "Dados Bancários" },
];

export default function PersonProfileForm({
  profile,
  onProfileChange,
  onSubmit,
  onCancel,
  loading,
  errors,
}: PersonProfileFormProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    onProfileChange({ ...profile, [name]: value });
  };

  const handleNestedChange = (
    parentKey: "bankDataOne" | "bankDataTwo",
    fieldName: keyof IBankData,
    value: string
  ) => {
    onProfileChange({
      ...profile,
      [parentKey]: {
        ...profile[parentKey],
        [fieldName]: value,
      } as IBankData,
    });
  };

  const handleSelectChange = (
    name: string,
    value: string | number | boolean | (string | number | boolean)[]
  ) => {
    onProfileChange({ ...profile, [name]: value });
  };

  const genderOptions: ISelectOption[] = [
    { value: "M", label: "Masculino" },
    { value: "F", label: "Feminino" },
    { value: "N", label: "Neutro" },
    { value: "O", label: "Outro" },
  ];

  const stateOptions = STATES.map((s) => ({ value: s.uf, label: s.stateName }));

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <KuTab
        tabs={tabs}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        formState={profile}
      />

      <div className="mt-6">
        {activeTabId === "main" && (
          <KuFieldset id="main-section" title="Informações Pessoais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KuInput
                name="personName"
                label="Nome Completo"
                value={profile.personName || ""}
                onChange={handleChange}
                isRequired
                error={errors.personName}
                type="input"
                dataType="text"
              />
              <KuInput
                name="personNickname"
                label="Apelido"
                value={profile.personNickname || ""}
                onChange={handleChange}
                error={errors.personNickname}
                type="input"
                dataType="text"
              />
              <KuSelect
                name="gender"
                label="Gênero"
                options={genderOptions}
                value={profile.gender || ""}
                onChange={handleSelectChange}
                isRequired
                error={errors.gender}
                type="select"
                dataType="text"
              />
              <KuInput
                name="birthday"
                dataType="date"
                label="Data de Nascimento"
                value={profile.birthday || ""}
                onChange={handleChange}
                isRequired
                error={errors.birthday}
                type="input"
              />
              <KuSelect
                name="maritalStatus"
                label="Estado Civil"
                options={maritalStatusOptions}
                value={profile.maritalStatus || ""}
                onChange={handleSelectChange}
                error={errors.maritalStatus}
                type="select"
                dataType="text"
              />
              <KuInput
                name="motherName"
                label="Nome da Mãe"
                value={profile.motherName || ""}
                onChange={handleChange}
                error={errors.motherName}
                type="input"
                dataType="text"
              />
              <KuInput
                name="fatherName"
                label="Nome do Pai"
                value={profile.fatherName || ""}
                onChange={handleChange}
                error={errors.fatherName}
                type="input"
                dataType="text"
              />
            </div>
            <div className="mt-6">
              <label
                htmlFor="personDescription"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Sobre Você
              </label>
              <Textarea
                id="personDescription"
                name="personDescription"
                value={profile.personDescription || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Conte um pouco sobre você..."
              />
            </div>
          </KuFieldset>
        )}

        {activeTabId === "documents" && (
          <KuFieldset id="documents-section" title="Documentos Pessoais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KuInput
                name="cpf"
                label="CPF"
                value={profile.cpf || ""}
                onChange={handleChange}
                error={errors.cpf}
                type="input"
                dataType="text"
              />
              <KuFile
                name="cpfFile"
                label="Arquivo do CPF"
                type="file"
                error={errors.cpfFile}
              />
              <KuInput
                name="rg"
                label="RG"
                value={profile.rg || ""}
                onChange={handleChange}
                error={errors.rg}
                type="input"
                dataType="text"
              />
              <KuInput
                name="rgIssuingAuthority"
                label="Órgão Emissor"
                value={profile.rgIssuingAuthority || ""}
                onChange={handleChange}
                error={errors.rgIssuingAuthority}
                type="input"
                dataType="text"
              />
              <KuInput
                name="rgIssuanceDate"
                label="Data de Emissão"
                value={profile.rgIssuanceDate || ""}
                onChange={handleChange}
                error={errors.rgIssuanceDate}
                type="input"
                dataType="date"
              />
              <KuSelect
                name="rgState"
                label="Estado Emissor do RG"
                options={stateOptions}
                value={profile.rgState || ""}
                onChange={handleSelectChange}
                error={errors.rgState}
                type="select"
                dataType="text"
              />
              <KuFile
                name="rgFile"
                label="Arquivo do RG"
                type="file"
                error={errors.rgFile}
              />
            </div>
          </KuFieldset>
        )}

        {activeTabId === "addresses" && (
          <KuFieldset id="address-one-section" title="Endereço Principal">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <KuInput
                name="addressOneCepBrasilApi"
                label="CEP"
                value={profile.addressOneCepBrasilApi || ""}
                onChange={handleChange}
                error={errors.addressOneCepBrasilApi}
                type="input"
                dataType="text"
              />
              <KuSelect
                name="addressOneType"
                label="Tipo"
                options={addressTypeOptions}
                value={profile.addressOneType || ""}
                onChange={handleSelectChange}
                error={errors.addressOneType}
                type="select"
                dataType="text"
              />
              <KuInput
                name="addressOneStreet"
                label="Logradouro"
                value={profile.addressOneStreet || ""}
                onChange={handleChange}
                error={errors.addressOneStreet}
                type="input"
                dataType="text"
              />
              <KuInput
                name="addressOneNumber"
                label="Número"
                value={profile.addressOneNumber || ""}
                onChange={handleChange}
                error={errors.addressOneNumber}
                type="input"
                dataType="text"
              />
              <KuInput
                name="addressOneComplement"
                label="Complemento"
                value={profile.addressOneComplement || ""}
                onChange={handleChange}
                error={errors.addressOneComplement}
                type="input"
                dataType="text"
              />
              <KuInput
                name="addressOneCity"
                label="Cidade"
                value={profile.addressOneCity || ""}
                onChange={handleChange}
                error={errors.addressOneCity}
                type="input"
                dataType="text"
              />
              <KuSelect
                name="addressOneState"
                label="Estado"
                options={stateOptions}
                value={profile.addressOneState || ""}
                onChange={handleSelectChange}
                error={errors.addressOneState}
                type="select"
                dataType="text"
              />
            </div>
          </KuFieldset>
        )}

        {activeTabId === "education" && (
          <KuFieldset id="education-section" title="Formação e Idiomas">
            <KuSelect
              name="personEducation"
              label="Nível de Escolaridade"
              options={educationLevelOptions}
              value={profile.personEducation || ""}
              onChange={handleSelectChange}
              error={errors.personEducation}
              type="select"
              dataType="text"
            />
            <KuSelect
              name="personLanguages"
              label="Idiomas"
              options={languageOptions}
              value={profile.personLanguages || []}
              onChange={handleSelectChange}
              isMultiple
              error={errors.personLanguages}
              type="select"
              dataType="text"
            />
          </KuFieldset>
        )}

        {activeTabId === "banking" && (
          <KuFieldset id="bank-one-section" title="Dados Bancários Principais">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KuInput
                name="bankName"
                label="Banco"
                value={profile.bankDataOne?.bankName || ""}
                onChange={(e) =>
                  handleNestedChange("bankDataOne", "bankName", e.target.value)
                }
                error={errors["bankDataOne.bankName"]}
                type="input"
                dataType="text"
              />
              <KuInput
                name="bankBranch"
                label="Agência"
                value={profile.bankDataOne?.bankBranch || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "bankDataOne",
                    "bankBranch",
                    e.target.value
                  )
                }
                error={errors["bankDataOne.bankBranch"]}
                type="input"
                dataType="text"
              />
              <KuInput
                name="bankAccount"
                label="Conta"
                value={profile.bankDataOne?.bankAccount || ""}
                onChange={(e) =>
                  handleNestedChange(
                    "bankDataOne",
                    "bankAccount",
                    e.target.value
                  )
                }
                error={errors["bankDataOne.bankAccount"]}
                type="input"
                dataType="text"
              />
              <KuSelect
                name="bankAccountType"
                label="Tipo de Conta"
                options={bankAccountTypeOptions}
                value={profile.bankDataOne?.bankAccountType || ""}
                onChange={(_, val) =>
                  handleNestedChange(
                    "bankDataOne",
                    "bankAccountType",
                    String(val)
                  )
                }
                error={errors["bankDataOne.bankAccountType"]}
                type="select"
                dataType="text"
              />
            </div>
          </KuFieldset>
        )}
      </div>

      <div className="flex justify-end space-x-4 mt-8 px-4">
        <KuButton
          id="cancel-button"
          label="Cancelar"
          variant="secondary"
          onClick={onCancel}
          actionType="link"
          type="button"
        />
        <KuButton
          id="submit-button"
          label={loading ? "Salvando..." : "Salvar Perfil"}
          actionType="submit"
          isDisabled={loading}
          type="button"
        />
      </div>
    </form>
  );
}
