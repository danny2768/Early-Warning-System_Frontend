import { User } from "../../shared/interfaces/user.interface";

export interface RegisterRequest {
  user:    User;
  message: string;
}
