import { Category } from './category.model';

export interface Product {
  id?: number;
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  category?: Category;
  price: number;
  quantity?: number;
  reorderLevel?: number;
  createdAt?: string;
}

export interface ProductRequest {
  sku: string;
  barcode?: string;
  name: string;
  description?: string;
  categoryId: number;
  price: number;
  quantity?: number;
  reorderLevel?: number;
}
