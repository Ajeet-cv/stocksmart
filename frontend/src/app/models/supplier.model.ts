export interface Supplier {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt?: string;
}

export interface SupplierRequest {
  name: string;
  email?: string;
  phone?: string;
  address?: string;
}
