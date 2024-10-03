import { type Image, type User } from ".";

export type Partner = {
  id: number;
  link: string;
  description: string;
  name: string;
  creator: User;
  image: Image;
};

export type PartnersProps = {
  id?: number;
  link: string;
  description: string;
  name: string;
  image: Image | null;
};
