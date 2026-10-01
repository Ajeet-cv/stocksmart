import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideAngularModule, ShoppingCart, Home, Package, Tag, Truck, Database, ShoppingBag, Store, Barcode, BarChart3 } from 'lucide-angular';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, LucideAngularModule],
  template: `
    <aside class="w-64 bg-[#0f172a] text-slate-300 flex flex-col justify-between min-h-screen sticky top-0 z-40 border-r border-slate-800 font-sans select-none">
      <div>
        <!-- Top Logo & Header -->
        <div class="p-5 flex items-center gap-3 border-b border-slate-800/80">
          <div class="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 flex-shrink-0">
            <lucide-icon [img]="CartIcon" class="w-5 h-5"></lucide-icon>
          </div>
          <div>
            <h1 class="text-xl font-bold text-white tracking-tight leading-tight">StockSmart</h1>
            <p class="text-[11px] text-slate-400 font-medium leading-none mt-0.5">Retail Inventory Management System</p>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="p-3 space-y-1 mt-2">
          <a routerLink="/dashboard" routerLinkActive="bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20" [routerLinkActiveOptions]="{exact: true}"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all">
            <lucide-icon [img]="HomeIcon" class="w-4 h-4"></lucide-icon>
            <span>Home</span>
          </a>

          <a routerLink="/products" routerLinkActive="bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all">
            <lucide-icon [img]="ProductsIcon" class="w-4 h-4"></lucide-icon>
            <span>Products</span>
          </a>

          <a routerLink="/categories" routerLinkActive="bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all">
            <lucide-icon [img]="CategoriesIcon" class="w-4 h-4"></lucide-icon>
            <span>Categories</span>
          </a>

          <a routerLink="/suppliers" routerLinkActive="bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all">
            <lucide-icon [img]="SuppliersIcon" class="w-4 h-4"></lucide-icon>
            <span>Suppliers</span>
          </a>

          <a routerLink="/inventory" routerLinkActive="bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all">
            <lucide-icon [img]="InventoryIcon" class="w-4 h-4"></lucide-icon>
            <span>Inventory</span>
          </a>

          <a routerLink="/purchases" routerLinkActive="bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all">
            <lucide-icon [img]="PurchaseIcon" class="w-4 h-4"></lucide-icon>
            <span>Purchase</span>
          </a>

          <a routerLink="/sales" routerLinkActive="bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all">
            <lucide-icon [img]="SalesIcon" class="w-4 h-4"></lucide-icon>
            <span>Sales / POS</span>
          </a>

          <a routerLink="/locations" routerLinkActive="bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all">
            <lucide-icon [img]="BarcodeIcon" class="w-4 h-4"></lucide-icon>
            <span>Barcode Lookup</span>
          </a>

          <a routerLink="/reports" routerLinkActive="bg-blue-600 text-white font-semibold shadow-md shadow-blue-600/20"
             class="flex items-center gap-3 px-4 py-2.5 text-sm rounded-xl text-slate-300 hover:bg-slate-800/60 hover:text-white transition-all">
            <lucide-icon [img]="ReportsIcon" class="w-4 h-4"></lucide-icon>
            <span>Reports</span>
          </a>
        </nav>
      </div>

      <!-- Bottom Footer -->
      <div class="p-5 border-t border-slate-800/80 text-xs text-slate-500 font-medium">
        <p>© 2026 <strong class="text-slate-400">StockSmart</strong></p>
        <p class="text-[11px] mt-0.5">Version 1.0</p>
      </div>
    </aside>
  `
})
export class SidebarComponent {
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
}
