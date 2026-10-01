import { Location } from './location.model';
import { Product } from './product.model';

export interface SaleItem {
  id?: number;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Sale {
  id?: number;
  customerName: string;
  location: Location;
  totalAmount: number;
  saleDate?: string;
  status?: string;
  items?: SaleItem[];
}

export interface CreateSaleRequest {
  customerName: string;
  productId: number;
  locationId: number;
  quantity: number;
}
