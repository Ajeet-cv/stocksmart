import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { LucideShoppingCart, LucideLock, LucideMail, LucideUser, LucideArrowRight, LucideCheckCircle2, LucideAlertCircle } from '@lucide/angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideShoppingCart, LucideLock, LucideMail, LucideUser, LucideArrowRight, LucideCheckCircle2, LucideAlertCircle],
  template: `
    <div class="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <!-- Ambient Background Glows -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div class="w-full max-w-md bg-white border border-slate-200 rounded-2xl p-8 shadow-xl relative z-10">
        <!-- Logo Header -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/20">
            <svg lucideShoppingCart class="w-7 h-7 text-white"></svg>
          </div>
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">StockSmart</h2>
          <p class="text-xs text-slate-500 mt-1 font-medium">Retail Inventory Management System</p>
        </div>

        <!-- Mode Toggle Tabs -->
        <div class="flex bg-slate-100 p-1 rounded-xl mb-6 border border-slate-200">
          <button 
            [class.bg-blue-600]="activeTab === 'login'" 
            [class.text-white]="activeTab === 'login'" 
            [class.text-slate-600]="activeTab !== 'login'"
            (click)="switchTab('login')"
            class="flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center"
          >
            Sign In
          </button>
          <button 
            [class.bg-blue-600]="activeTab === 'register'" 
            [class.text-white]="activeTab === 'register'" 
            [class.text-slate-600]="activeTab !== 'register'"
            (click)="switchTab('register')"
            class="flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center"
          >
            Create Account
          </button>
        </div>

        <!-- Alert Banner -->
        <div *ngIf="errorMessage" class="p-3.5 mb-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <svg lucideAlertCircle class="w-4 h-4 flex-shrink-0"></svg>
          <span>{{ errorMessage }}</span>
        </div>

        <div *ngIf="successMessage" class="p-3.5 mb-5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center gap-2">
          <svg lucideCheckCircle2 class="w-4 h-4 flex-shrink-0"></svg>
          <span>{{ successMessage }}</span>
        </div>

        <!-- LOGIN FORM -->
        <form *ngIf="activeTab === 'login'" (ngSubmit)="onLogin()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Email Address</label>
            <div class="relative">
              <svg lucideMail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></svg>
              <input 
                type="email" 
                [(ngModel)]="loginEmail" 
                name="email" 
                required 
                placeholder="name@company.com" 
                class="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
            <div class="relative">
              <svg lucideLock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></svg>
              <input 
                type="password" 
                [(ngModel)]="loginPassword" 
                name="password" 
                required 
                placeholder="••••••••" 
                class="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer"
          >
            <span>{{ loading ? 'Signing In...' : 'Sign In to Dashboard' }}</span>
            <svg lucideArrowRight class="w-4 h-4"></svg>
          </button>
          <p *ngIf="loading" class="text-xs text-center text-slate-500 mt-2 animate-pulse font-medium">
            Connecting to server... (Render free tier may take up to a minute to wake up)
          </p>
        </form>

        <!-- REGISTER FORM -->
        <form *ngIf="activeTab === 'register'" (ngSubmit)="onRegister()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Full Name</label>
            <div class="relative">
              <svg lucideUser class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></svg>
              <input 
                type="text" 
                [(ngModel)]="regName" 
                name="regName" 
                required 
                placeholder="John Doe" 
                class="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Email Address</label>
            <div class="relative">
              <svg lucideMail class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></svg>
              <input 
                type="email" 
                [(ngModel)]="regEmail" 
                name="regEmail" 
                required 
                placeholder="name@company.com" 
                class="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-600">Password</label>
            <div class="relative">
              <svg lucideLock class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></svg>
              <input 
                type="password" 
                [(ngModel)]="regPassword" 
                name="regPassword" 
                required 
                placeholder="••••••••" 
                class="w-full bg-white border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="loading"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 mt-4 disabled:opacity-50 cursor-pointer"
          >
            <span>{{ loading ? 'Registering...' : 'Register Account' }}</span>
            <svg lucideArrowRight class="w-4 h-4"></svg>
          </button>
          <p *ngIf="loading" class="text-xs text-center text-slate-500 mt-2 animate-pulse font-medium">
            Connecting to server... (Render free tier may take up to a minute to wake up)
          </p>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  activeTab: 'login' | 'register' = 'login';
  loading = false;
  errorMessage = '';
  successMessage = '';

  loginEmail = '';
  loginPassword = '';

  regName = '';
  regEmail = '';
  regPassword = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  switchTab(tab: 'login' | 'register') {
    this.activeTab = tab;
    this.errorMessage = '';
    this.successMessage = '';
  }

  onLogin() {
    if (!this.loginEmail || !this.loginPassword) {
      this.errorMessage = 'Please provide both email and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .login({ email: this.loginEmail, password: this.loginPassword })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = this.extractErrorMessage(err, 'Invalid email or password.');
          this.cdr.markForCheck();
        }
      });
  }

  onRegister() {
    if (!this.regName || !this.regEmail || !this.regPassword) {
      this.errorMessage = 'Please complete all required fields.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService
      .register({ name: this.regName, email: this.regEmail, password: this.regPassword })
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.markForCheck();
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.errorMessage = this.extractErrorMessage(err, 'Registration failed. Please try again.');
          this.cdr.markForCheck();
        }
      });
  }

  private extractErrorMessage(err: any, defaultMsg: string): string {
    if (err?.name === 'TimeoutError') {
      return 'Server response timed out. The backend on Render free tier may still be waking up — please retry in a few moments.';
    }
    if (err?.status === 0) {
      return 'Unable to connect to backend server. Please verify backend status and CORS settings.';
    }
    if (err?.status === 409) {
      return 'User with this email already exists.';
    }
    if (err?.status === 401) {
      return 'Invalid email or password.';
    }
    if (err?.error) {
      if (typeof err.error === 'string') {
        return err.error;
      }
      if (typeof err.error.message === 'string') {
        return err.error.message;
      }
      if (typeof err.error.detail === 'string') {
        return err.error.detail;
      }
    }
    if (err?.message && typeof err.message === 'string') {
      return err.message;
    }
    return defaultMsg;
  }
}

