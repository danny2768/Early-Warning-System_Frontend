import { Pagination } from "./pagination.interface";
import { Station } from "./station.interface";

export interface StationResponse {
  pagination: Pagination;
  stations:   Station[];
}
