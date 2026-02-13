export enum ProductStockStatus {
    InStock = 'InStock',
    LowStock = 'LowStock',
    OutOfStock = 'OutOfStock'
}

export interface WarehouseStockDto {
    warehouseId: string;
    warehouseName: string;
    quantity: number;
    stockValue: number;
}

export interface ProductDetailDto {
    id: string;
    sku: string;
    name: string;
    description: string;
    category: string;
    reorderPoint: number;
    unitPrice: number;
    totalCompanyStock: number;
    stockStatus: ProductStockStatus;
    warehouseStock: WarehouseStockDto[];
}

export interface Product {
    id: string;
    sku: string;
    name: string;
    category: string;
    stockStatus: string;
    totalQuantity: number;
    unitPrice: number;
}
