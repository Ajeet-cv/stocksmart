import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Sale } from '../models/sale.model';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Sale[]> {
    return this.http.get<Sale[]>(this.apiUrl);
  }

  getById(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${id}`);
  }

  createSale(customerName: string, productId: number, locationId: number, quantity: number): Observable<Sale> {
    const params = new HttpParams()
      .set('customerName', customerName)
      .set('productId', productId.toString())
      .set('locationId', locationId.toString())
      .set('quantity', quantity.toString());
    return this.http.post<Sale>(this.apiUrl, null, { params });
  }
}
