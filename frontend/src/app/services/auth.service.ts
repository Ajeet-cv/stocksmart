import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, timeout } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  get apiUrl(): string {
    return `${environment.apiUrl}/auth`;
  }

  getApiBaseUrl(): string {
    return environment.apiUrl;
  }

  setCustomApiUrl(url: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      let trimmed = url.trim();
      while (trimmed.endsWith('/')) {
        trimmed = trimmed.substring(0, trimmed.length - 1);
      }
      if (trimmed) {
        localStorage.setItem('stocksmart_api_url', trimmed);
      } else {
        localStorage.removeItem('stocksmart_api_url');
      }
    }
  }

  checkHealth(customBaseUrl?: string): Observable<{ status: string; service?: string }> {
    let base = customBaseUrl ? customBaseUrl.trim() : environment.apiUrl;
    while (base.endsWith('/')) {
      base = base.substring(0, base.length - 1);
    }
    const healthUrl = base.endsWith('/api') ? `${base}/health` : `${base}/api/health`;
    return this.http.get<{ status: string; service?: string }>(healthUrl).pipe(
      timeout(10000)
    );
  }

  currentUser = signal<{ email: string; role: string } | null>(this.getStoredUser());
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, request).pipe(
      timeout(45000),
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user_email', res.email);
          localStorage.setItem('user_role', res.role);
          this.currentUser.set({ email: res.email, role: res.role });
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      timeout(45000),
      tap(res => {
        if (res && res.token) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('user_email', res.email);
          localStorage.setItem('user_role', res.role);
          this.currentUser.set({ email: res.email, role: res.role });
          this.isLoggedIn.set(true);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('user_role');
    this.currentUser.set(null);
    this.isLoggedIn.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  private getStoredUser() {
    const email = localStorage.getItem('user_email');
    const role = localStorage.getItem('user_role');
    if (email && role) {
      return { email, role };
    }
    return null;
  }
}
