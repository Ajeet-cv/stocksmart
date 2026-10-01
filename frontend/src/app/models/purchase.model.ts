import { Supplier } from './supplier.model';
import { Location } from './location.model';
import { Product } from './product.model';

export interface PurchaseItem {
  id?: number;
  product: Product;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

export interface Purchase {
  id?: number;
  supplier: Supplier;
  location: Location;
  totalAmount: number;
  purchaseDate?: string;
  status?: string;
  items?: PurchaseItem[];
}

export interface ReceivePurchaseRequest {
  supplierId: number;
  locationId: number;
  productId: number;
  quantity: number;
  unitCost: number;
}
