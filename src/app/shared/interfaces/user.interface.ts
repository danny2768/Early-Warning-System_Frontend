export interface User {
  id:             string;
  name:           string;
  email:          string;
  emailValidated: boolean;
  role:           Role[];
  phone:          Phone;
  createdAt:      Date;
  updatedAt:      Date;
}

export interface Phone {
  countryCode:   string | null;
  number:        string | null;
}

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN_ROLE',
  ADMIN = 'ADMIN_ROLE',
  USER = 'USER_ROLE',
}
