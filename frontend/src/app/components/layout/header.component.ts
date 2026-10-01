import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Search, Bell, Menu, ChevronDown, User } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <header class="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between sticky top-0 z-30 font-sans shadow-sm">
      <!-- Left: Hamburger & Search Bar -->
      <div class="flex items-center gap-4 flex-1 max-w-xl">
        <button class="text-slate-600 hover:text-slate-900 p-1.5 rounded-lg hover:bg-slate-100 transition-all">
          <lucide-icon [img]="MenuIcon" class="w-5 h-5"></lucide-icon>
        </button>

        <div class="relative w-full max-w-md">
          <lucide-icon [img]="SearchIcon" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></lucide-icon>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (ngModelChange)="onSearchChange()"
            placeholder="Search products, SKU, barcode..." 
            class="w-full bg-slate-100 border border-transparent rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-300 transition-all font-medium"
          />
        </div>
      </div>

      <!-- Right: Notifications & User Profile -->
      <div class="flex items-center gap-5">
        <!-- Notification Bell -->
        <div class="relative cursor-pointer p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all">
          <lucide-icon [img]="BellIcon" class="w-5 h-5"></lucide-icon>
          <span class="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white">
            2
          </span>
        </div>

        <div class="h-6 w-[1px] bg-slate-200"></div>

        <!-- User Profile Dropdown -->
        <div (click)="toggleDropdown()" class="relative flex items-center gap-3 cursor-pointer py-1 px-2 rounded-xl hover:bg-slate-100 transition-all">
          <div class="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20">
            <lucide-icon [img]="UserIcon" class="w-4 h-4 text-white"></lucide-icon>
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-bold text-slate-800 leading-tight">{{ userName }}</p>
            <p class="text-[11px] font-medium text-slate-400 leading-none mt-0.5">{{ userRole }}</p>
          </div>
          <lucide-icon [img]="ChevronIcon" class="w-4 h-4 text-slate-400 ml-1"></lucide-icon>

          <!-- Dropdown Menu -->
          <div *ngIf="showMenu" class="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-fade-in">
            <div class="px-4 py-2 border-b border-slate-100">
              <p class="text-xs font-bold text-slate-800">{{ userName }}</p>
              <p class="text-[11px] text-slate-400 truncate">{{ userEmail }}</p>
            </div>
            <button (click)="logout()" class="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {
  MenuIcon = Menu;
  SearchIcon = Search;
  BellIcon = Bell;
  ChevronIcon = ChevronDown;
  UserIcon = User;

  searchQuery = '';
  showMenu = false;

  @Output() search = new EventEmitter<string>();

  constructor(private authService: AuthService, private router: Router) {}

  get userName(): string {
    const email = this.authService.currentUser()?.email || 'User';
    return email.split('@')[0];
  }

  get userEmail(): string {
    return this.authService.currentUser()?.email || '';
  }

  get userRole(): string {
    return this.authService.currentUser()?.role || 'Admin';
  }

  onSearchChange() {
    this.search.emit(this.searchQuery);
  }

  toggleDropdown() {
    this.showMenu = !this.showMenu;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
