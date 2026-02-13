export interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    stockStatus: string;
    totalQuantity: number;
    unitPrice: number;
}

export interface PaginatedResult<T> {
    items: T[];
    totalCount: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    pageNumber: number;
    pageSize: number;
}

