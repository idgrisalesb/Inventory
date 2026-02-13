export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageNumber: number;
    pageSize: number;
}
