export interface User {
  id:             string;
  name:           string;
  email:          string;
  emailValidated: boolean;
  role:           string[];
  createdAt:      Date;
  updatedAt:      Date;
}
