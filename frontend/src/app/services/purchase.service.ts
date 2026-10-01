import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Purchase } from '../models/purchase.model';

@Injectable({
  providedIn: 'root'
})
export class PurchaseService {
  private apiUrl = `${environment.apiUrl}/purchases`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(this.apiUrl);
  }

  getById(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.apiUrl}/${id}`);
  }

  receive(supplierId: number, locationId: number, productId: number, quantity: number, unitCost: number): Observable<Purchase> {
    const params = new HttpParams()
      .set('supplierId', supplierId.toString())
      .set('locationId', locationId.toString())
      .set('productId', productId.toString())
      .set('quantity', quantity.toString())
      .set('unitCost', unitCost.toString());
    return this.http.post<Purchase>(`${this.apiUrl}/receive`, null, { params });
  }
}
