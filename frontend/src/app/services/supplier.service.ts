import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Supplier, SupplierRequest } from '../models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {
  private apiUrl = `${environment.apiUrl}/suppliers`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  create(request: SupplierRequest): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, request);
  }

  update(id: number, request: SupplierRequest): Observable<Supplier> {
    return this.http.put<Supplier>(`${this.apiUrl}/${id}`, request);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
