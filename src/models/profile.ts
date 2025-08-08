export interface IBankData {
  bankName: string;
  bankBranch: string;
  bankAccount: string;
  bankAccountType: string;
}

export interface IPersonProfile {
  _id?: string;
  personName: string;
  personNickname: string;
  gender: string;
  birthday: string | undefined;
  maritalStatus: string;
  motherName: string;
  fatherName: string;
  personDescription: string;
  tagId: string[];
  cpf: string;
  cpfFile: File | null;
  rg: string;
  rgIssuingAuthority: string;
  rgIssuanceDate: string | undefined;
  rgState: string;
  rgFile: File | null;
  passport: string;
  passportIssuanceDate: string | undefined;
  passportExpirationDate: string | undefined;
  passportFile: File | null;
  phoneNumberOne: string;
  phoneNumberTwo: string;
  emailOne: string;
  emailTwo: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  x: string;
  addressOneCepBrasilApi: string;
  addressOneType: string;
  addressOneStreet: string;
  addressOneNumber: string;
  addressOneComplement: string;
  addressOneCity: string;
  addressOneState: string;
  addressTwoCepBrasilApi: string;
  addressTwoType: string;
  addressTwoStreet: string;
  addressTwoNumber: string;
  addressTwoComplement: string;
  addressTwoCity: string;
  addressTwoState: string;
  personEducation: string;
  personLanguages: string[];
  bankDataOne: IBankData;
  bankDataTwo: IBankData;
}

export interface IContact {
  contactType: string;
  contactValue: string;
  contactComplement: string;
}

export interface IRelatedFile {
  filesDescription: string;
  relatedFilesFiles: FileList | null;
  relatedFilesDateDay: number;
  relatedFilesDateMonth: number;
  relatedFilesDateYear: number;
}

export interface IPartner {
  name: string;
  role: string;
}

export interface ICompanyProfile {
  _id?: string;
  companyName: string;
  businessName: string;
  cnpj: string;
  birthday: string | undefined;
  legalNature: string;
  companyDescription: string;
  logoImage: File | null;
  companyImages: File[];
  tagId: string[];
  partners: IPartner[];
  contacts: IContact[];
  addressOneCepBrasilApi: string;
  addressOneType: string;
  addressOneStreet: string;
  addressOneNumber: string;
  addressOneComplement: string;
  addressOneCity: string;
  addressOneState: string;
  addressTwoCepBrasilApi: string;
  addressTwoType: string;
  addressTwoStreet: string;
  addressTwoNumber: string;
  addressTwoComplement: string;
  addressTwoCity: string;
  addressTwoState: string;
  bankDataOne: IBankData;
  bankDataTwo: IBankData;
  relatedFiles: IRelatedFile[];
}
