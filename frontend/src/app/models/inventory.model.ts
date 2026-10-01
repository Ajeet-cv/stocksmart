import { Product } from './product.model';
import { Location } from './location.model';

export interface Inventory {
  id?: number;
  product: Product;
  location: Location;
  quantity: number;
  updatedAt?: string;
}

export interface AddStockRequest {
  productId: number;
  locationId: number;
  quantity: number;
}

export interface TransferStockRequest {
  productId: number;
  fromLocationId: number;
  toLocationId: number;
  quantity: number;
}
