export type CompanyCategory = {
  id: number;
  name: string;
};

export type CompanyRegion = {
  id: number;
  name: string;
};

export type ContactPerson = {
  id: string;
  firstname: string;
  middlename: string;
  lastname: string;
  email: string;
  phone: string;
  position: string;
  add_information: string;
};

export type Company = {
  id: number;
  name: string;
  link: string;
  inn: string;
  trademarks: string;
  product_information: string;
  okved: {
    id: number;
    name: string;
  } | null;
  contact_person: ContactPerson;
  company_category: CompanyCategory;
  average_headcount: number;
  region_registration: CompanyRegion;
  revenue_year: number;
  region_presences: CompanyRegion[];
};
