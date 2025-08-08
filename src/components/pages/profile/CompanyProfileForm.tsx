import { useState } from "react";
import {
  KuInput,
  KuSelect,
  KuFile,
  KuFieldset,
  KuButton,
  KuArray,
} from "@/components/form";
import { STATES } from "@/constants/states";
import {
  addressTypeOptions,
  contactTypeOptions,
  bankAccountTypeOptions,
} from "@/constants/options";
import { Textarea, Button } from "flowbite-react";
import type {
  ICompanyProfile,
  IContact,
  IBankData,
  IRelatedFile,
} from "@/models/profile";
import KuTab from "@/components/form/KuTab";

interface CompanyProfileFormProps {
  profile: Partial<ICompanyProfile>;
  onProfileChange: (profile: Partial<ICompanyProfile>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  loading: boolean;
  errors: Record<string, string>;
}

const tabs = [
  { id: "main", title: "Dados Principais" },
  { id: "contacts", title: "Contatos" },
  { id: "addresses", title: "Endereços" },
  { id: "files", title: "Arquivos" },
  { id: "banking", title: "Dados Bancários" },
];

export default function CompanyProfileForm({
  profile,
  onProfileChange,
  onSubmit,
  onCancel,
  loading,
  errors,
}: CompanyProfileFormProps) {
  const [activeTabId, setActiveTabId] = useState(tabs[0].id);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    onProfileChange({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (
    name: string,
    value: string | number | boolean | (string | number | boolean)[]
  ) => {
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
          <KuFieldset id="main-company-section" title="Informações da Empresa">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <KuInput
                name="companyName"
                label="Razão Social"
                value={profile.companyName || ""}
                onChange={handleChange}
                isRequired
                error={errors.companyName}
                type="input"
                dataType="text"
              />
              <KuInput
                name="businessName"
                label="Nome Fantasia"
                value={profile.businessName || ""}
                onChange={handleChange}
                isRequired
                error={errors.businessName}
                type="input"
                dataType="text"
              />
              <KuInput
                name="cnpj"
                label="CNPJ"
                placeholder="00.000.000/0000-00"
                value={profile.cnpj || ""}
                onChange={handleChange}
                isRequired
                error={errors.cnpj}
                type="input"
                dataType="text"
              />
              <KuInput
                name="birthday"
                dataType="date"
                label="Data de Fundação"
                value={profile.birthday || ""}
                onChange={handleChange}
                isRequired
                error={errors.birthday}
                type="input"
              />
              <KuInput
                name="legalNature"
                label="Natureza Jurídica"
                value={profile.legalNature || ""}
                onChange={handleChange}
                error={errors.legalNature}
                type="input"
                dataType="text"
              />
              <KuFile
                name="logoImage"
                label="Logo da Empresa"
                type="file"
                error={errors.logoImage}
              />
            </div>
            <div className="mt-6">
              <label
                htmlFor="companyDescription"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Descrição da Empresa
              </label>
              <Textarea
                id="companyDescription"
                name="companyDescription"
                value={profile.companyDescription || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Descreva sua empresa..."
              />
            </div>
          </KuFieldset>
        )}

        {activeTabId === "contacts" && (
          <KuArray<IContact>
            title="Contatos"
            items={profile.contacts || []}
            onItemsChange={(newContacts) =>
              onProfileChange({ ...profile, contacts: newContacts })
            }
            defaultNewItem={{
              contactType: "",
              contactValue: "",
              contactComplement: "",
            }}
            renderItem={(item, index, handleItemChange, handleRemoveItem) => (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Contato {index + 1}</h4>
                  <Button
                    size="xs"
                    color="light"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remover
                  </Button>
                </div>
                <KuSelect
                  name={`contactType-${index}`}
                  label="Tipo"
                  options={contactTypeOptions}
                  value={item.contactType}
                  onChange={(_, val) =>
                    handleItemChange(index, {
                      ...item,
                      contactType: String(val),
                    })
                  }
                  type="select"
                  dataType="text"
                />
                <KuInput
                  name={`contactValue-${index}`}
                  label="Contato"
                  value={item.contactValue}
                  onChange={(e) =>
                    handleItemChange(index, {
                      ...item,
                      contactValue: e.target.value,
                    })
                  }
                  type="input"
                  dataType="text"
                />
                <KuInput
                  name={`contactComplement-${index}`}
                  label="Complemento"
                  value={item.contactComplement}
                  onChange={(e) =>
                    handleItemChange(index, {
                      ...item,
                      contactComplement: e.target.value,
                    })
                  }
                  type="input"
                  dataType="text"
                />
              </div>
            )}
          />
        )}

        {activeTabId === "addresses" && (
          <KuFieldset id="address-one-section" title="Endereço Principal">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {activeTabId === "files" && (
          <KuArray<IRelatedFile>
            title="Arquivos Relacionados"
            items={profile.relatedFiles || []}
            onItemsChange={(newFiles) =>
              onProfileChange({ ...profile, relatedFiles: newFiles })
            }
            defaultNewItem={{
              filesDescription: "",
              relatedFilesFiles: null,
              relatedFilesDateDay: new Date().getDate(),
              relatedFilesDateMonth: new Date().getMonth() + 1,
              relatedFilesDateYear: new Date().getFullYear(),
            }}
            renderItem={(item, index, handleItemChange, handleRemoveItem) => (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-medium">Arquivo {index + 1}</h4>
                  <Button
                    size="xs"
                    color="light"
                    onClick={() => handleRemoveItem(index)}
                  >
                    Remover
                  </Button>
                </div>
                <KuInput
                  name={`filesDescription-${index}`}
                  label="Descrição"
                  value={item.filesDescription || ""}
                  onChange={(e) =>
                    handleItemChange(index, {
                      ...item,
                      filesDescription: e.target.value,
                    })
                  }
                  type="input"
                  dataType="text"
                />
                <KuFile
                  name={`relatedFilesFiles-${index}`}
                  label="Arquivo"
                  type="file"
                />
              </div>
            )}
          />
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
          id="cancel-company-button"
          label="Cancelar"
          variant="secondary"
          onClick={onCancel}
          actionType="link"
          type="button"
        />
        <KuButton
          id="submit-company-button"
          label={loading ? "Salvando..." : "Salvar Perfil"}
          actionType="submit"
          isDisabled={loading}
          type="button"
        />
      </div>
    </form>
  );
}
