import { Pagination } from "../../shared/interfaces/pagination.interface";
import { Station } from "../../shared/interfaces/station.interface";

export interface StationResponse {
  pagination: Pagination;
  stations:   Station[];
}
