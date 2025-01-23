export interface User {
  id:             string;
  name:           string;
  email:          string;
  emailValidated: boolean;
  role:           string[];
  phone:          Phone;
  createdAt:      Date;
  updatedAt:      Date;
}

export interface Phone {
  countryCode:   string | null;
  number:        string | null;
}
