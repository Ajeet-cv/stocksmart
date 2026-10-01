import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Inventory } from '../models/inventory.model';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private apiUrl = `${environment.apiUrl}/inventory`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(this.apiUrl);
  }

  getLowStock(): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/low-stock`);
  }

  getByProduct(productId: number): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/product/${productId}`);
  }

  getByLocation(locationId: number): Observable<Inventory[]> {
    return this.http.get<Inventory[]>(`${this.apiUrl}/location/${locationId}`);
  }

  addStock(productId: number, locationId: number, quantity: number): Observable<Inventory> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('locationId', locationId.toString())
      .set('quantity', quantity.toString());
    return this.http.post<Inventory>(`${this.apiUrl}/add`, null, { params });
  }

  removeStock(productId: number, locationId: number, quantity: number): Observable<Inventory> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('locationId', locationId.toString())
      .set('quantity', quantity.toString());
    return this.http.post<Inventory>(`${this.apiUrl}/remove`, null, { params });
  }

  transferStock(productId: number, fromLocationId: number, toLocationId: number, quantity: number): Observable<string> {
    const params = new HttpParams()
      .set('productId', productId.toString())
      .set('fromLocationId', fromLocationId.toString())
      .set('toLocationId', toLocationId.toString())
      .set('quantity', quantity.toString());
    return this.http.post(`${this.apiUrl}/transfer`, null, { params, responseType: 'text' });
  }
}
