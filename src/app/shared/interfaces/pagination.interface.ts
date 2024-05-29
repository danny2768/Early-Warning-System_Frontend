export interface Pagination {
  page:       number;
  limit:      number;
  totalItems: number;
  totalPages: number;
  next:       null | string;
  prev:       null | string;
  first:      string;
  last:       string;
}
