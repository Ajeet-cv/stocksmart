import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Home, Package, Tag, Truck, Database, ShoppingBag, Store, Barcode, BarChart3, X } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <!-- Mobile Backdrop Overlay -->
    <div 
      *ngIf="isOpen" 
      (click)="closeSidebar.emit()" 
      class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden transition-opacity"
    ></div>

    <!-- Sidebar Aside Container -->
    <aside 
      [class.translate-x-0]="isOpen"
      [class.-translate-x-full]="!isOpen"
      class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white text-slate-700 flex flex-col justify-between min-h-screen border-r border-slate-200 font-sans select-none shadow-xl lg:shadow-sm lg:translate-x-0 transition-transform duration-300 ease-in-out"
    >
      <div>
        <!-- Top Logo & Header (Clickable to refresh app) -->
        <div class="p-5 flex items-center justify-between border-b border-slate-100">
          <div (click)="refreshPage()" title="Click to refresh StockSmart" class="flex items-center gap-3 cursor-pointer hover:bg-slate-50/80 transition-all rounded-xl p-1 -m-1">
            <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <lucide-icon [img]="CartIcon" class="w-5 h-5"></lucide-icon>
            </div>
            <div>
              <h1 class="text-xl font-bold text-slate-900 tracking-tight leading-tight">StockSmart</h1>
              <p class="text-[11px] text-slate-500 font-medium leading-none mt-0.5">Retail Inventory System</p>
            </div>
          </div>

          <!-- Close button for mobile -->
          <button (click)="closeSidebar.emit()" class="lg:hidden text-slate-400 hover:text-slate-700 p-1 rounded-lg">
            <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
          </button>
        </div>

        <!-- Navigation Menu -->
        <nav class="p-3 space-y-1 mt-2">
          <a (click)="onNavClick()" routerLink="/dashboard" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all">
            <lucide-icon [img]="HomeIcon" class="w-4 h-4"></lucide-icon>
            <span>Home</span>
          </a>

          <a (click)="onNavClick()" routerLink="/products" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all">
            <lucide-icon [img]="ProductsIcon" class="w-4 h-4"></lucide-icon>
            <span>Products</span>
          </a>

          <a (click)="onNavClick()" routerLink="/categories" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all">
            <lucide-icon [img]="CategoriesIcon" class="w-4 h-4"></lucide-icon>
            <span>Categories</span>
          </a>

          <a (click)="onNavClick()" routerLink="/suppliers" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all">
            <lucide-icon [img]="SuppliersIcon" class="w-4 h-4"></lucide-icon>
            <span>Suppliers</span>
          </a>

          <a (click)="onNavClick()" routerLink="/inventory" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all">
            <lucide-icon [img]="InventoryIcon" class="w-4 h-4"></lucide-icon>
            <span>Inventory</span>
          </a>

          <a (click)="onNavClick()" routerLink="/purchases" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all">
            <lucide-icon [img]="PurchaseIcon" class="w-4 h-4"></lucide-icon>
            <span>Purchase</span>
          </a>

          <a (click)="onNavClick()" routerLink="/sales" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all">
            <lucide-icon [img]="SalesIcon" class="w-4 h-4"></lucide-icon>
            <span>Sales / POS</span>
          </a>

          <a (click)="onNavClick()" routerLink="/barcode" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all">
            <lucide-icon [img]="BarcodeIcon" class="w-4 h-4"></lucide-icon>
            <span>Barcode Lookup</span>
          </a>

          <a (click)="onNavClick()" routerLink="/reports" routerLinkActive="bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-600 hover:bg-slate-100 hover:text-slate-900 font-medium transition-all">
            <lucide-icon [img]="ReportsIcon" class="w-4 h-4"></lucide-icon>
            <span>Reports</span>
          </a>
        </nav>
      </div>

      <!-- Bottom Footer -->
      <div class="p-5 border-t border-slate-100 text-xs text-slate-400 font-medium">
        <p>© 2026 <strong class="text-slate-700 font-semibold">StockSmart</strong></p>
        <p class="text-[11px] text-slate-400 mt-0.5">Version 1.0</p>
      </div>
    </aside>
  `
})
export class SidebarComponent {
  @Input() isOpen = false;
  @Output() closeSidebar = new EventEmitter<void>();

  CartIcon = ShoppingCart;
  HomeIcon = Home;
  ProductsIcon = Package;
  CategoriesIcon = Tag;
  SuppliersIcon = Truck;
  InventoryIcon = Database;
  PurchaseIcon = ShoppingBag;
  SalesIcon = Store;
  BarcodeIcon = Barcode;
  ReportsIcon = BarChart3;
  XIcon = X;

  onNavClick() {
    this.closeSidebar.emit();
  }

  refreshPage() {
    window.location.href = '/dashboard';
  }
}
