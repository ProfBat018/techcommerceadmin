export interface PaginatedResult<T> {
  isSuccess: boolean;
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  message?: string;
}
