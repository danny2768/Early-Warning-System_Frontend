import { User } from "../../shared/interfaces/user.interface";

export interface LoginRequest {
  user:  User;
  token: string;
}
