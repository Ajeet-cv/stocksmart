import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LucideAngularModule, ShoppingCart, Lock, Mail, User, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-angular';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      <!-- Ambient Background Glows -->
      <div class="absolute -top-40 -left-40 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <div class="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative z-10">
        <!-- Logo Header -->
        <div class="text-center mb-8">
          <div class="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-600/30">
            <lucide-icon [img]="CartIcon" class="w-7 h-7 text-white"></lucide-icon>
          </div>
          <h2 class="text-2xl font-extrabold text-white tracking-tight">StockSmart</h2>
          <p class="text-xs text-slate-400 mt-1 font-medium">Retail Inventory Management System</p>
        </div>

        <!-- Mode Toggle Tabs -->
        <div class="flex bg-slate-950 p-1 rounded-xl mb-6 border border-slate-800">
          <button 
            [class.bg-blue-600]="activeTab === 'login'" 
            [class.text-white]="activeTab === 'login'" 
            [class.text-slate-400]="activeTab !== 'login'"
            (click)="switchTab('login')"
            class="flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center"
          >
            Sign In
          </button>
          <button 
            [class.bg-blue-600]="activeTab === 'register'" 
            [class.text-white]="activeTab === 'register'" 
            [class.text-slate-400]="activeTab !== 'register'"
            (click)="switchTab('register')"
            class="flex-1 py-2 text-xs font-semibold rounded-lg transition-all text-center"
          >
            Create Account
          </button>
        </div>

        <!-- Alert Banner -->
        <div *ngIf="errorMessage" class="p-3.5 mb-5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-2">
          <lucide-icon [img]="AlertIcon" class="w-4 h-4 flex-shrink-0"></lucide-icon>
          <span>{{ errorMessage }}</span>
        </div>

        <div *ngIf="successMessage" class="p-3.5 mb-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
          <lucide-icon [img]="CheckIcon" class="w-4 h-4 flex-shrink-0"></lucide-icon>
          <span>{{ successMessage }}</span>
        </div>

        <!-- LOGIN FORM -->
        <form *ngIf="activeTab === 'login'" (ngSubmit)="onLogin()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <div class="relative">
              <lucide-icon [img]="MailIcon" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></lucide-icon>
              <input 
                type="email" 
                [(ngModel)]="loginEmail" 
                name="email" 
                required 
                placeholder="name@company.com" 
                class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
            <div class="relative">
              <lucide-icon [img]="LockIcon" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></lucide-icon>
              <input 
                type="password" 
                [(ngModel)]="loginPassword" 
                name="password" 
                required 
                placeholder="••••••••" 
                class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="loading"
            class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            <span>{{ loading ? 'Signing In...' : 'Sign In to Dashboard' }}</span>
            <lucide-icon [img]="ArrowIcon" class="w-4 h-4"></lucide-icon>
          </button>
        </form>

        <!-- REGISTER FORM -->
        <form *ngIf="activeTab === 'register'" (ngSubmit)="onRegister()" class="space-y-4">
          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">Full Name</label>
            <div class="relative">
              <lucide-icon [img]="UserIcon" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></lucide-icon>
              <input 
                type="text" 
                [(ngModel)]="regName" 
                name="regName" 
                required 
                placeholder="John Doe" 
                class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
            <div class="relative">
              <lucide-icon [img]="MailIcon" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></lucide-icon>
              <input 
                type="email" 
                [(ngModel)]="regEmail" 
                name="regEmail" 
                required 
                placeholder="name@company.com" 
                class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div class="space-y-1.5">
            <label class="block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
            <div class="relative">
              <lucide-icon [img]="LockIcon" class="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2"></lucide-icon>
              <input 
                type="password" 
                [(ngModel)]="regPassword" 
                name="regPassword" 
                required 
                placeholder="••••••••" 
                class="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <button 
            type="submit" 
            [disabled]="loading"
            class="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm py-3 rounded-xl transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
          >
            <span>{{ loading ? 'Registering...' : 'Register Account' }}</span>
            <lucide-icon [img]="ArrowIcon" class="w-4 h-4"></lucide-icon>
          </button>
        </form>
      </div>
    </div>
  `
})
export class LoginComponent {
  CartIcon = ShoppingCart;
  LockIcon = Lock;
  MailIcon = Mail;
  UserIcon = User;
  ArrowIcon = ArrowRight;
  CheckIcon = CheckCircle2;
  AlertIcon = AlertCircle;

  activeTab: 'login' | 'register' = 'login';
  loading = false;
  errorMessage = '';
  successMessage = '';

  loginEmail = '';
  loginPassword = '';

  regName = '';
  regEmail = '';
  regPassword = '';

  constructor(private authService: AuthService, private router: Router) {}

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

    this.authService.login({ email: this.loginEmail, password: this.loginPassword }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401 || err.status === 400) {
          this.errorMessage = 'Invalid username or password.';
        } else if (err.status === 0) {
          this.errorMessage = 'Unable to connect to backend server. Please check server status.';
        } else {
          this.errorMessage = err?.error?.message || 'Invalid username or password.';
        }
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

    this.authService.register({ name: this.regName, email: this.regEmail, password: this.regPassword }).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Registration successful! You can now sign in.';
        this.loginEmail = this.regEmail;
        this.switchTab('login');
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 409) {
          this.errorMessage = 'User with this email already exists.';
        } else if (err.status === 0) {
          this.errorMessage = 'Unable to connect to backend server. Please check server status.';
        } else {
          this.errorMessage = err?.error?.message || err?.error || 'Registration failed. Please try again.';
        }
      }
    });
  }
}
