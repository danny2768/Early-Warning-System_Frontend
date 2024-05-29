import { Network } from "../../shared/interfaces/network.interface";
import { Pagination } from "../../shared/interfaces/pagination.interface";

export interface NetworkResponse {
  pagination: Pagination;
  networks:   Network[];
}
