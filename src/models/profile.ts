export interface IBankData {
  bankName: string;
  bankBranch: string;
  bankAccount: string;
  bankAccountType: string;
}

export interface IProfession {
  jobId: string;
  jobStartDateMonth: number;
  jobStartDateYear: number;
  jobFinishDateMonth: number;
  jobFinishDateYear: number;
  jobDescription: string;
}

export interface IPersonEducation {
  personEducationCourse: string;
  personEducationInstitution: string;
  personEducationStartDate: string;
  personEducationFinishDate: string;
  personEducationDescription: string;
  personEducationCertificateFile: string;
}

export interface IPersonCourse {
  personCourseName: string;
  personCourseInstitution: string;
  personCourseStartDate: string;
  personCourseFinishDate: string;
  personCourseCertificateFile: string;
}

export interface IRelatedFile {
  filesDescription: string;
  relatedFilesFiles: string;
  relatedFilesDateDay: number;
  relatedFilesDateMonth: number;
  relatedFilesDateYear: number;
}

export interface IPersonProfile {
  _id?: string;
  userId: string;
  userName: string;
  personName: string;
  personNickname: string;
  gender: string;
  birthday: string;
  maritalStatus: string;
  motherName: string;
  tagId: string[];
  personDescription: string;
  cpf: string;
  cpfFile: string;
  rg: string;
  rgIssuingAuthority: string;
  rgIssuanceDate: string;
  rgState: string;
  rgFile: string;
  passport: string;
  passportIssuanceDate: string;
  passportExpirationDate: string;
  phoneNumberOne: string;
  phoneNumberTwo: string;
  emailOne: string;
  emailTwo: string;
  linkedin: string;
  instagram: string;
  facebook: string;
  addressOneCepBrasilApi: string;
  addressOneType: string;
  addressOneStreet: string;
  addressOneNumber: string;
  addressOneCity: string;
  addressOneState: string;
  addressTwoCepBrasilApi: string;
  addressTwoType: string;
  addressTwoStreet: string;
  addressTwoNumber: string;
  addressTwoCity: string;
  addressTwoState: string;
  professions: IProfession[];
  personEducation: string;
  personEducations: IPersonEducation[];
  personCourses: IPersonCourse[];
  personLanguages: number;
  bankDataOne: IBankData;
  bankDataTwo: IBankData;
  relatedFiles: IRelatedFile[];
  createdBy: string;
  ownerId: string;
}

export interface IContact {
  contactType: string;
  contactValue: string;
  contactComplement: string;
}

export interface IPartner {
  personId: string;
}

export interface ICompanyProfile {
  _id?: string;
  userId: string;
  userName: string;
  cnpj: string;
  companyName: string;
  businessName: string;
  birthday: string;
  legalNature: string;
  companyDescription: string;
  logoImage: string;
  companyImages: string[];
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
  createdBy: string;
  ownerId: string;
}
