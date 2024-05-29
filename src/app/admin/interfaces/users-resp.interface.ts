import { Pagination } from "../../shared/interfaces/pagination.interface";
import { User } from "../../shared/interfaces/user.interface";

export interface UserResponse {
  pagination: Pagination;
  users:      User[];
}
