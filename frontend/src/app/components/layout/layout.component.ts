import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { SidebarComponent } from './sidebar.component';
import { HeaderComponent } from './header.component';
import { ProductService } from '../../services/product.service';
import { InventoryService } from '../../services/inventory.service';
import { Product } from '../../models/product.model';
import { Inventory } from '../../models/inventory.model';
import { LucideAngularModule, Barcode, AlertTriangle, X, Search, CheckCircle2 } from 'lucide-angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent, HeaderComponent, LucideAngularModule, FormsModule],
  template: `
    <div class="flex min-h-screen bg-[#f8fafc] text-slate-800 font-sans">
      <!-- Responsive Sidebar -->
      <app-sidebar [isOpen]="isMobileSidebarOpen" (closeSidebar)="isMobileSidebarOpen = false"></app-sidebar>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col min-w-0">
        <app-header 
          (toggleSidebar)="isMobileSidebarOpen = !isMobileSidebarOpen"
          (openBarcodeModal)="showBarcodeModal = true"
          (openLowStockModal)="openLowStockAlerts()"
          (openNewSaleModal)="navigateToSales()"
        ></app-header>

        <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <router-outlet></router-outlet>
        </main>
      </div>

      <!-- Quick Barcode Lookup Modal -->
      <div *ngIf="showBarcodeModal" class="modal-overlay">
        <div class="modal-card">
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
                <lucide-icon [img]="BarcodeIcon" class="w-5 h-5"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-900">Barcode Scanner & Quick Search</h3>
                <p class="text-xs text-slate-500 font-medium">Scan or enter barcode number to locate product</p>
              </div>
            </div>
            <button (click)="closeBarcodeModal()" class="text-slate-400 hover:text-slate-700 transition-all">
              <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>

          <div class="space-y-4">
            <div class="form-group">
              <label class="form-label">Barcode Number</label>
              <div class="flex gap-2">
                <input 
                  type="text" 
                  [(ngModel)]="barcodeInput" 
                  (keyup.enter)="searchBarcode()"
                  placeholder="e.g. 890123456789" 
                  class="form-input flex-1"
                  autofocus
                />
                <button (click)="searchBarcode()" [disabled]="loadingBarcode" class="gradient-btn-primary px-5 py-2.5 rounded-xl font-semibold text-sm flex items-center gap-2">
                  <lucide-icon [img]="SearchIcon" class="w-4 h-4"></lucide-icon>
                  <span>Lookup</span>
                </button>
              </div>
            </div>

            <div *ngIf="barcodeError" class="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
              <lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon>
              <span>{{ barcodeError }}</span>
            </div>

            <div *ngIf="foundProduct" class="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div class="flex justify-between items-start">
                <div>
                  <span class="badge badge-indigo mb-1">SKU: {{ foundProduct.sku }}</span>
                  <h4 class="text-lg font-bold text-slate-900">{{ foundProduct.name }}</h4>
                </div>
                <div class="text-right">
                  <p class="text-xl font-extrabold text-blue-600">\${{ foundProduct.price }}</p>
                  <span class="text-xs text-slate-500 font-medium">Unit Price</span>
                </div>
              </div>
              <p class="text-sm text-slate-600">{{ foundProduct.description || 'No description available' }}</p>
              <div class="pt-3 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 font-medium">
                <span>Category: <strong class="text-slate-900">{{ foundProduct.category?.name || 'Uncategorized' }}</strong></span>
                <span>Current Quantity: <strong class="text-emerald-600 font-bold text-sm">{{ foundProduct.quantity || 0 }}</strong></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Low Stock Alerts Modal -->
      <div *ngIf="showLowStockModal" class="modal-overlay">
        <div class="modal-card max-w-2xl">
          <div class="flex justify-between items-center mb-6">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 flex items-center justify-center">
                <lucide-icon [img]="AlertIcon" class="w-5 h-5"></lucide-icon>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-900">Low Stock Warning Items</h3>
                <p class="text-xs text-slate-500 font-medium">Inventory items reaching critical reorder levels</p>
              </div>
            </div>
            <button (click)="showLowStockModal = false" class="text-slate-400 hover:text-slate-700 transition-all">
              <lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon>
            </button>
          </div>

          <div *ngIf="lowStockItems.length === 0" class="p-8 text-center text-slate-500">
            <lucide-icon [img]="CheckCircleIcon" class="w-10 h-10 text-emerald-600 mx-auto mb-2"></lucide-icon>
            <p class="font-medium">All stock levels are optimal! No items below reorder threshold.</p>
          </div>

          <div *ngIf="lowStockItems.length > 0" class="space-y-3 max-h-96 overflow-y-auto pr-1">
            <div *ngFor="let item of lowStockItems" class="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
              <div>
                <div class="flex items-center gap-2">
                  <h4 class="font-bold text-slate-900">{{ item.product?.name }}</h4>
                  <span class="badge badge-amber">SKU: {{ item.product?.sku }}</span>
                </div>
                <p class="text-xs text-slate-500 mt-1">Location: {{ item.location?.name }} ({{ item.location?.type }})</p>
              </div>
              <div class="text-right">
                <p class="text-lg font-bold text-amber-700">{{ item.quantity }} units</p>
                <span class="text-xs text-slate-500 font-medium">Reorder Level: {{ item.product?.reorderLevel || 10 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LayoutComponent {
  BarcodeIcon = Barcode;
  AlertIcon = AlertTriangle;
  XIcon = X;
  SearchIcon = Search;
  CheckCircleIcon = CheckCircle2;

  isMobileSidebarOpen = false;
  showBarcodeModal = false;
  showLowStockModal = false;
  barcodeInput = '';
  loadingBarcode = false;
  barcodeError = '';
  foundProduct: Product | null = null;
  lowStockItems: Inventory[] = [];

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private router: Router
  ) {}

  closeBarcodeModal() {
    this.showBarcodeModal = false;
    this.barcodeInput = '';
    this.barcodeError = '';
    this.foundProduct = null;
  }

  searchBarcode() {
    if (!this.barcodeInput.trim()) return;
    this.loadingBarcode = true;
    this.barcodeError = '';
    this.foundProduct = null;

    this.productService.getByBarcode(this.barcodeInput.trim()).subscribe({
      next: (product: Product) => {
        this.foundProduct = product;
        this.loadingBarcode = false;
      },
      error: () => {
        this.barcodeError = `No product found matching barcode "${this.barcodeInput}"`;
        this.loadingBarcode = false;
      }
    });
  }

  openLowStockAlerts() {
    this.showLowStockModal = true;
    this.inventoryService.getLowStock().subscribe({
      next: (items: Inventory[]) => {
        this.lowStockItems = items || [];
      },
      error: () => {
        this.lowStockItems = [];
      }
    });
  }

  navigateToSales() {
    this.router.navigate(['/sales']);
  }
}
