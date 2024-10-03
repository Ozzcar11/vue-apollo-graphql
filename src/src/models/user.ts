import { type Company, type Role } from ".";

export type UserProfile = {
  firstname: string;
  lastname: string;
  middlename: string;
  position: string;
  work_name: string;
  phone: string;
};

export type User = {
  id: number;
  email: string;
  application_limit: number;
  profile: UserProfile;
  experts?: User[];
  role: Role;
  maintainer: User | null;
  company: Company;
};

export type UsersProps = {
  id?: number | null;
  email: string;
  application_limit: number | null;
  old_password?: string;
  password?: string;
  repeat_password?: string;
  profile: UserProfile;
  role: Role | null;
  maintainer: User | null;
  experts?: User[];
};
