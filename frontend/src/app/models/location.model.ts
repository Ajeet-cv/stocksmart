export interface Location {
  id?: number;
  name: string;
  address?: string;
  type?: string;
  createdAt?: string;
}

export interface LocationRequest {
  name: string;
  address?: string;
  type?: string;
}
