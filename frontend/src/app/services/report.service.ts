import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DashboardMetrics } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.apiUrl}/reports`;

  constructor(private http: HttpClient) {}

  getDashboardMetrics(): Observable<DashboardMetrics> {
    return this.http.get<DashboardMetrics>(`${this.apiUrl}/dashboard`);
  }
}
