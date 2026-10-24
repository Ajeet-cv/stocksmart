import { Component, EventEmitter, Output, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideMenu, LucideSearch, LucideBell, LucideAlertTriangle, LucideShoppingCart, LucideShoppingBag, LucideUser, LucideChevronDown } from '@lucide/angular';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideMenu, LucideSearch, LucideBell, LucideAlertTriangle, LucideShoppingCart, LucideShoppingBag, LucideUser, LucideChevronDown],
  template: `
    <header class="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 font-sans shadow-sm">
      <!-- Left: Mobile Hamburger & Search Bar -->
      <div class="flex items-center gap-2 sm:gap-4 flex-1 max-w-xl">
        <button (click)="toggleSidebar.emit()" class="lg:hidden text-slate-600 hover:text-slate-900 p-2 rounded-xl hover:bg-slate-100 transition-all cursor-pointer flex-shrink-0">
          <svg lucideMenu class="w-5 h-5"></svg>
        </button>

        <div class="relative w-full max-w-md">
          <svg lucideSearch class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></svg>
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
      <div class="flex items-center gap-3 sm:gap-5">
        <!-- Notification Bell -->
        <div class="relative">
          <button (click)="toggleNotifications($event)" class="cursor-pointer p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all relative">
            <svg lucideBell class="w-5 h-5"></svg>
            <span class="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-white font-bold text-[10px] rounded-full flex items-center justify-center border-2 border-white">
              3
            </span>
          </button>

          <!-- Notification Drawer Popover -->
          <div *ngIf="showNotifications" (click)="$event.stopPropagation()" class="absolute right-0 top-12 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl py-3 z-50 animate-fade-in font-sans">
            <div class="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-700">System Notifications</h4>
              <span class="badge badge-indigo">3 New</span>
            </div>
            
            <div class="divide-y divide-slate-100 max-h-80 overflow-y-auto">
              <div (click)="navigateTo('/inventory')" class="p-3 hover:bg-slate-50 cursor-pointer transition-all flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg lucideAlertTriangle class="w-4 h-4"></svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900">Low Stock Alert</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">3 items have reached reorder threshold.</p>
                </div>
              </div>

              <div (click)="navigateTo('/sales')" class="p-3 hover:bg-slate-50 cursor-pointer transition-all flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg lucideShoppingCart class="w-4 h-4"></svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900">New Sale Completed</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">Order #ORD-1 fulfilled successfully.</p>
                </div>
              </div>

              <div (click)="navigateTo('/purchases')" class="p-3 hover:bg-slate-50 cursor-pointer transition-all flex items-start gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <svg lucideShoppingBag class="w-4 h-4"></svg>
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900">PO Received</p>
                  <p class="text-[11px] text-slate-500 mt-0.5">Purchase Order #PO-1 received from vendor.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="h-6 w-[1px] bg-slate-200"></div>

        <!-- User Profile Dropdown -->
        <div (click)="toggleDropdown($event)" class="relative flex items-center gap-3 cursor-pointer py-1 px-2 rounded-xl hover:bg-slate-100 transition-all">
          <div class="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20">
            <svg lucideUser class="w-4 h-4 text-white"></svg>
          </div>
          <div class="hidden sm:block text-left">
            <p class="text-xs font-bold text-slate-800 leading-tight">{{ userName }}</p>
            <p class="text-[11px] font-medium text-slate-400 leading-none mt-0.5">{{ userRole }}</p>
          </div>
          <svg lucideChevronDown class="w-4 h-4 text-slate-400 ml-1"></svg>

          <!-- Dropdown Menu -->
          <div *ngIf="showMenu" (click)="$event.stopPropagation()" class="absolute right-0 top-12 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-fade-in">
            <div class="px-4 py-2 border-b border-slate-100">
              <p class="text-xs font-bold text-slate-800">{{ userName }}</p>
              <p class="text-[11px] text-slate-400 truncate">{{ userEmail }}</p>
            </div>
            <button (click)="logout()" class="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition-all cursor-pointer">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
  `
})
export class HeaderComponent {

  searchQuery = '';
  showMenu = false;
  showNotifications = false;

  @Output() search = new EventEmitter<string>();
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(
    private authService: AuthService, 
    private router: Router,
    private elementRef: ElementRef
  ) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.showMenu = false;
      this.showNotifications = false;
    }
  }

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

  toggleDropdown(event: MouseEvent) {
    event.stopPropagation();
    this.showNotifications = false;
    this.showMenu = !this.showMenu;
  }

  toggleNotifications(event: MouseEvent) {
    event.stopPropagation();
    this.showMenu = false;
    this.showNotifications = !this.showNotifications;
  }

  navigateTo(path: string) {
    this.showNotifications = false;
    this.router.navigate([path]);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
