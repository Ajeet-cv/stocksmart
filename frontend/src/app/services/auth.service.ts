import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RegisterRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  currentUser = signal<{ email: string; role: string } | null>(this.getStoredUser());
  isLoggedIn = signal<boolean>(!!localStorage.getItem('token'));

  constructor(private http: HttpClient) {}

  register(request: RegisterRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/register`, request).pipe(
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
