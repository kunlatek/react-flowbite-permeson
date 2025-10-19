import { BankData, RelatedFile, Education, Course, Profession, Address } from '.';

export class PersonProfile {
  _id?: string;
  userId: string;
  userName: string;
  personName?: string;
  personNickname?: string;
  gender?: string;
  birthday?: string;
  maritalStatus?: string;
  motherName?: string;
  tagId?: string[];
  personDescription?: string;
  cpf?: string;
  cpfFile?: string;
  rg?: string;
  rgIssuingAuthority?: string;
  rgIssuanceDate?: string;
  rgState?: string;
  rgFile?: string;
  passport?: string;
  passportIssuanceDate?: string;
  passportExpirationDate?: string;
  phoneNumbers?: string[];
  emails?: string[];
  linkedin?: string;
  instagram?: string;
  facebook?: string;
  addresses?: Address[];
  professions?: Profession[];
  educations?: Education[];
  courses?: Course[];
  languages?: number;
  bankDatas?: BankData[];
  relatedFiles?: RelatedFile[];
  createdBy?: string;
  
  constructor(
    userId: string, 
    userName: string, 
    personName: string, 
    personNickname: string, 
    gender: string, 
    birthday: string, 
    maritalStatus: string, 
    motherName: string, 
    courses: Course[],
    languages: number,
    educations: Education[],
    bankDatas: BankData[],
    relatedFiles: RelatedFile[],
    createdBy: string,
  ) {
    this.userId = userId;
    this.userName = userName;
    this.personName = personName;
    this.personNickname = personNickname;
    this.gender = gender;
    this.birthday = birthday;
    this.maritalStatus = maritalStatus;
    this.motherName = motherName;
    this.educations = educations;
    this.courses = courses;
    this.languages = languages;
    this.bankDatas = bankDatas;
    this.relatedFiles = relatedFiles;
    this.createdBy = createdBy;
  }
}