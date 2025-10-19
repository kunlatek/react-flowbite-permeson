import { BankData, Contact, RelatedFile, Partner, Address } from '.';

export class CompanyProfile {
  _id?: string;
  userId: string;
  userName: string;
  companyName?: string;
  cnpj?: string;
  businessName?: string;
  birthday?: string;
  legalNature?: string;
  companyDescription?: string;
  logoImage?: string;
  companyImages?: string[];
  tagId?: string[];
  partners?: Partner[];
  contacts?: Contact[];
  addresses?: Address[];
  bankDatas?: BankData[];
  relatedFiles?: RelatedFile[];
  createdBy?: string;

  constructor(
    userId: string, 
    userName: string, 
    companyName?: string, 
    cnpj?: string, 
    businessName?: string, 
    birthday?: string, 
    legalNature?: string, 
    companyDescription?: string, 
    logoImage?: string, 
    companyImages?: string[], 
    tagId?: string[], 
    partners?: Partner[], 
    contacts?: Contact[], 
    addresses?: Address[], 
    bankDatas?: BankData[], 
    relatedFiles?: RelatedFile[], 
    createdBy?: string
  ) {
    this.userId = userId;
    this.userName = userName;
    this.companyName = companyName;
    this.cnpj = cnpj;
    this.businessName = businessName;
    this.birthday = birthday;
    this.legalNature = legalNature;
    this.companyDescription = companyDescription;
    this.logoImage = logoImage;
    this.companyImages = companyImages;
    this.tagId = tagId;
    this.partners = partners;
    this.contacts = contacts;
    this.addresses = addresses;
    this.bankDatas = bankDatas;
    this.relatedFiles = relatedFiles;
    this.createdBy = createdBy;
  }
}