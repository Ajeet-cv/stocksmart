import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ReportService } from '../../services/report.service';
import { InventoryService } from '../../services/inventory.service';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';
import { PurchaseService } from '../../services/purchase.service';
import { AuthService } from '../../services/auth.service';
import { DashboardMetrics } from '../../models/dashboard.model';
import { Product } from '../../models/product.model';
import { Inventory } from '../../models/inventory.model';
import { Sale } from '../../models/sale.model';
import { LucideAngularModule, Package, ShoppingCart, ShoppingBag, Database, ArrowRight, Calendar, AlertCircle, CheckCircle2, User, PlusCircle } from 'lucide-angular';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LucideAngularModule],
  template: `
    <div class="space-y-6 font-sans text-slate-800 animate-fade-in pb-12">
      <!-- Welcome Header -->
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-slate-900 tracking-tight">Welcome Back, {{ userName }}!</h1>
          <p class="text-xs text-slate-500 font-medium mt-1">Here's what's happening with your store today.</p>
        </div>
        <div class="flex items-center gap-2 text-xs font-semibold text-slate-500 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-sm">
          <lucide-icon [img]="CalendarIcon" class="w-4 h-4 text-slate-400"></lucide-icon>
          <span>{{ currentDate }}</span>
        </div>
      </div>

      <!-- 4 Top Stat Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Total Products -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Products</p>
              <h3 class="text-3xl font-extrabold text-slate-900 mt-2">{{ metrics?.totalProducts || 0 }}</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <lucide-icon [img]="PackageIcon" class="w-6 h-6"></lucide-icon>
            </div>
          </div>
          <a routerLink="/products" class="mt-4 inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700">
            View Products <lucide-icon [img]="ArrowRightIcon" class="w-3.5 h-3.5"></lucide-icon>
          </a>
        </div>

        <!-- Total Sales -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales</p>
              <h3 class="text-3xl font-extrabold text-slate-900 mt-2">{{ metrics?.totalSales || 0 }}</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <lucide-icon [img]="CartIcon" class="w-6 h-6"></lucide-icon>
            </div>
          </div>
          <a routerLink="/sales" class="mt-4 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 hover:text-emerald-700">
            View Sales <lucide-icon [img]="ArrowRightIcon" class="w-3.5 h-3.5"></lucide-icon>
          </a>
        </div>

        <!-- Total Purchases -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Purchases</p>
              <h3 class="text-3xl font-extrabold text-slate-900 mt-2">{{ metrics?.totalPurchases || 0 }}</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <lucide-icon [img]="BagIcon" class="w-6 h-6"></lucide-icon>
            </div>
          </div>
          <a routerLink="/purchases" class="mt-4 inline-flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-700">
            View Purchases <lucide-icon [img]="ArrowRightIcon" class="w-3.5 h-3.5"></lucide-icon>
          </a>
        </div>

        <!-- Low Stock Items -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock Items</p>
              <h3 class="text-3xl font-extrabold text-slate-900 mt-2">{{ lowStockItems.length }}</h3>
            </div>
            <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <lucide-icon [img]="DatabaseIcon" class="w-6 h-6"></lucide-icon>
            </div>
          </div>
          <a routerLink="/inventory" class="mt-4 inline-flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700">
            View Inventory <lucide-icon [img]="ArrowRightIcon" class="w-3.5 h-3.5"></lucide-icon>
          </a>
        </div>
      </div>

      <!-- Main Content Grid: Products Table & Activities -->
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <!-- Left: Recent Products Data Table -->
        <div class="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-900">Recent Products</h3>
            <a routerLink="/products" class="text-xs font-bold text-blue-600 hover:text-blue-700">View All →</a>
          </div>

          <div *ngIf="loadingProducts" class="py-12 text-center text-xs text-slate-400 font-medium">
            Loading products from database...
          </div>

          <div *ngIf="!loadingProducts && products.length === 0" class="py-12 text-center text-xs text-slate-400 font-medium">
            No products found in database. Add your first product to get started.
          </div>

          <div *ngIf="!loadingProducts && products.length > 0" class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead>
                <tr class="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider">
                  <th class="py-3 px-2">ID</th>
                  <th class="py-3 px-2">Name</th>
                  <th class="py-3 px-2">SKU</th>
                  <th class="py-3 px-2">Category</th>
                  <th class="py-3 px-2">Stock</th>
                  <th class="py-3 px-2">Price</th>
                  <th class="py-3 px-2 text-right">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 font-medium text-slate-700">
                <tr *ngFor="let p of products.slice(0, 5)">
                  <td class="py-3 px-2 text-slate-400">#{{ p.id }}</td>
                  <td class="py-3 px-2 font-bold text-slate-900">{{ p.name }}</td>
                  <td class="py-3 px-2 text-slate-500">{{ p.sku }}</td>
                  <td class="py-3 px-2">{{ p.category?.name || 'N/A' }}</td>
                  <td class="py-3 px-2 font-semibold">{{ p.quantity || 0 }}</td>
                  <td class="py-3 px-2">₹ {{ p.price }}</td>
                  <td class="py-3 px-2 text-right">
                    <span 
                      class="px-2.5 py-1 rounded-full text-[10px] font-bold"
                      [ngClass]="{
                        'bg-emerald-100 text-emerald-700': (p.quantity || 0) > (p.reorderLevel || 10),
                        'bg-amber-100 text-amber-700': (p.quantity || 0) <= (p.reorderLevel || 10) && (p.quantity || 0) > 0,
                        'bg-rose-100 text-rose-700': (p.quantity || 0) <= 0
                      }"
                    >
                      {{ (p.quantity || 0) <= 0 ? 'Out of Stock' : ((p.quantity || 0) <= (p.reorderLevel || 10) ? 'Low Stock' : 'In Stock') }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Right: Recent Activity / Low Stock Summary -->
        <div class="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-900">Low Stock Alerts</h3>
            <a routerLink="/inventory" class="text-xs font-bold text-blue-600 hover:text-blue-700">View Inventory →</a>
          </div>

          <div *ngIf="lowStockItems.length === 0" class="py-12 text-center text-xs text-slate-400 font-medium">
            <lucide-icon [img]="CheckIcon" class="w-8 h-8 text-emerald-500 mx-auto mb-2"></lucide-icon>
            All product quantities are at healthy levels!
          </div>

          <div *ngIf="lowStockItems.length > 0" class="space-y-3">
            <div *ngFor="let item of lowStockItems.slice(0, 5)" class="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
              <div>
                <p class="text-xs font-bold text-slate-900">{{ item.product?.name }}</p>
                <p class="text-[11px] text-slate-500">Location: {{ item.location?.name || 'Main Warehouse' }}</p>
              </div>
              <div class="text-right">
                <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700">
                  {{ item.quantity }} in stock
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  PackageIcon = Package;
  CartIcon = ShoppingCart;
  BagIcon = ShoppingBag;
  DatabaseIcon = Database;
  ArrowRightIcon = ArrowRight;
  CalendarIcon = Calendar;
  AlertIcon = AlertCircle;
  CheckIcon = CheckCircle2;
  UserIcon = User;
  PlusIcon = PlusCircle;

  metrics: DashboardMetrics | null = null;
  products: Product[] = [];
  lowStockItems: Inventory[] = [];
  recentSales: Sale[] = [];
  loadingProducts = true;
  currentDate = new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

  constructor(
    private reportService: ReportService,
    private productService: ProductService,
    private inventoryService: InventoryService,
    private saleService: SaleService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  get userName(): string {
    const email = this.authService.currentUser()?.email || 'User';
    return email.split('@')[0];
  }

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.reportService.getDashboardMetrics().subscribe({
      next: (data) => {
        this.metrics = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load metrics', err)
    });

    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data || [];
        this.loadingProducts = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Failed to load products', err);
        this.loadingProducts = false;
        this.cdr.detectChanges();
      }
    });

    this.inventoryService.getLowStock().subscribe({
      next: (data) => {
        this.lowStockItems = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load low stock', err)
    });

    this.saleService.getAll().subscribe({
      next: (data) => {
        this.recentSales = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load sales', err)
    });
  }
}
