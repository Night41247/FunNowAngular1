export interface CPaging<T> {
  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  data: T[];
}
