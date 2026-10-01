import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { ProductService } from '../../services/product.service';
import { LocationService } from '../../services/location.service';
import { Inventory } from '../../models/inventory.model';
import { Product } from '../../models/product.model';
import { Location } from '../../models/location.model';
import { LucideAngularModule, Plus, Minus, ArrowRightLeft, Search, Filter, AlertTriangle, X, Check, ArrowDownUp } from 'lucide-angular';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-white tracking-tight">Stock & Inventory Management</h2>
          <p class="text-sm text-slate-400">Track stock levels, record additions, adjustments, and inter-warehouse transfers</p>
        </div>
        <div class="flex items-center gap-3 flex-wrap">
          <button (click)="openAddModal()" class="gradient-btn-primary px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
            <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add Stock
          </button>
          <button (click)="openRemoveModal()" class="btn btn-secondary text-sm flex items-center gap-2">
            <lucide-icon [img]="MinusIcon" class="w-4 h-4"></lucide-icon> Deduct Stock
          </button>
          <button (click)="openTransferModal()" class="btn btn-secondary text-sm flex items-center gap-2 text-indigo-400 border-indigo-500/30">
            <lucide-icon [img]="TransferIcon" class="w-4 h-4"></lucide-icon> Transfer Stock
          </button>
        </div>
      </div>

      <!-- Filters Bar -->
      <div class="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="relative flex-1 md:w-72">
            <lucide-icon [img]="SearchIcon" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></lucide-icon>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Filter by product or location..." class="form-input pl-10 py-2 text-sm" />
          </div>
          
          <select [(ngModel)]="filterLocationId" (change)="onLocationFilterChange()" class="form-select py-2 text-sm">
            <option [value]="0">All Locations</option>
            <option *ngFor="let loc of locations" [value]="loc.id">{{ loc.name }}</option>
          </select>

          <button (click)="toggleLowStockOnly()" 
                  [class.bg-amber-500\/20]="showOnlyLowStock" 
                  [class.border-amber-500\/40]="showOnlyLowStock"
                  [class.text-amber-400]="showOnlyLowStock"
                  class="btn btn-secondary text-xs flex items-center gap-2 whitespace-nowrap">
            <lucide-icon [img]="AlertIcon" class="w-4 h-4"></lucide-icon> Low Stock Only
          </button>
        </div>

        <span class="text-xs text-slate-400 font-semibold">{{ filteredInventory.length }} Stock Records</span>
      </div>

      <!-- Notification Toast -->
      <div *ngIf="toastMessage" class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-between">
        <span>{{ toastMessage }}</span>
        <button (click)="toastMessage = ''" class="text-emerald-400 hover:text-white"><lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon></button>
      </div>

      <!-- Inventory Data Table -->
      <div class="glass-panel overflow-hidden border-white/10">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Product SKU</th>
                <th>Product Name</th>
                <th>Location</th>
                <th>Location Type</th>
                <th>Stock Quantity</th>
                <th>Reorder Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="filteredInventory.length === 0">
                <td colspan="7" class="text-center py-8 text-slate-400">
                  No stock records found matching your filters.
                </td>
              </tr>
              <tr *ngFor="let inv of filteredInventory">
                <td class="font-mono text-xs font-bold text-indigo-400">{{ inv.product?.sku }}</td>
                <td>
                  <div class="font-bold text-slate-100">{{ inv.product?.name }}</div>
                  <div class="text-xs text-slate-400">\${{ inv.product?.price }} / unit</div>
                </td>
                <td class="font-semibold text-slate-200">{{ inv.location?.name }}</td>
                <td>
                  <span class="badge badge-indigo">{{ inv.location?.type || 'Warehouse' }}</span>
                </td>
                <td class="font-extrabold text-lg" [class.text-amber-400]="inv.quantity <= (inv.product?.reorderLevel || 10)" [class.text-emerald-400]="inv.quantity > (inv.product?.reorderLevel || 10)">
                  {{ inv.quantity }} units
                </td>
                <td class="text-slate-400 text-xs">{{ inv.product?.reorderLevel || 10 }} units</td>
                <td>
                  <span *ngIf="inv.quantity <= (inv.product?.reorderLevel || 10)" class="badge badge-amber flex items-center gap-1">
                    <lucide-icon [img]="AlertIcon" class="w-3 h-3"></lucide-icon> Low Stock
                  </span>
                  <span *ngIf="inv.quantity > (inv.product?.reorderLevel || 10)" class="badge badge-emerald">
                    Optimal
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ADD STOCK MODAL -->
      <div *ngIf="showAddModal" class="modal-overlay">
        <div class="modal-card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              <lucide-icon [img]="PlusIcon" class="w-5 h-5 text-indigo-400"></lucide-icon> Add Stock to Location
            </h3>
            <button (click)="showAddModal = false" class="text-slate-400 hover:text-white"><lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon></button>
          </div>

          <form (ngSubmit)="submitAddStock()" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Select Product *</label>
              <select [(ngModel)]="stockForm.productId" name="productId" required class="form-select">
                <option [value]="0" disabled>Select Product</option>
                <option *ngFor="let p of products" [value]="p.id">{{ p.name }} (SKU: {{ p.sku }})</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Target Location *</label>
              <select [(ngModel)]="stockForm.locationId" name="locationId" required class="form-select">
                <option [value]="0" disabled>Select Location</option>
                <option *ngFor="let l of locations" [value]="l.id">{{ l.name }} ({{ l.type }})</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Quantity to Add *</label>
              <input type="number" min="1" [(ngModel)]="stockForm.quantity" name="quantity" required placeholder="50" class="form-input" />
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="showAddModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="gradient-btn-primary px-6 py-2.5 rounded-xl font-bold text-sm">Confirm Stock Addition</button>
            </div>
          </form>
        </div>
      </div>

      <!-- DEDUCT STOCK MODAL -->
      <div *ngIf="showRemoveModal" class="modal-overlay">
        <div class="modal-card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              <lucide-icon [img]="MinusIcon" class="w-5 h-5 text-rose-400"></lucide-icon> Deduct / Adjust Stock
            </h3>
            <button (click)="showRemoveModal = false" class="text-slate-400 hover:text-white"><lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon></button>
          </div>

          <form (ngSubmit)="submitRemoveStock()" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Select Product *</label>
              <select [(ngModel)]="stockForm.productId" name="productId" required class="form-select">
                <option [value]="0" disabled>Select Product</option>
                <option *ngFor="let p of products" [value]="p.id">{{ p.name }} (SKU: {{ p.sku }})</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Source Location *</label>
              <select [(ngModel)]="stockForm.locationId" name="locationId" required class="form-select">
                <option [value]="0" disabled>Select Location</option>
                <option *ngFor="let l of locations" [value]="l.id">{{ l.name }} ({{ l.type }})</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Quantity to Remove *</label>
              <input type="number" min="1" [(ngModel)]="stockForm.quantity" name="quantity" required placeholder="10" class="form-input" />
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="showRemoveModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="btn btn-danger px-6 py-2.5 rounded-xl font-bold text-sm">Deduct Stock</button>
            </div>
          </form>
        </div>
      </div>

      <!-- TRANSFER STOCK MODAL -->
      <div *ngIf="showTransferModal" class="modal-overlay">
        <div class="modal-card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              <lucide-icon [img]="TransferIcon" class="w-5 h-5 text-indigo-400"></lucide-icon> Transfer Stock Between Warehouses
            </h3>
            <button (click)="showTransferModal = false" class="text-slate-400 hover:text-white"><lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon></button>
          </div>

          <form (ngSubmit)="submitTransferStock()" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Select Product *</label>
              <select [(ngModel)]="transferForm.productId" name="productId" required class="form-select">
                <option [value]="0" disabled>Select Product</option>
                <option *ngFor="let p of products" [value]="p.id">{{ p.name }} (SKU: {{ p.sku }})</option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">From Location *</label>
                <select [(ngModel)]="transferForm.fromLocationId" name="fromLocationId" required class="form-select">
                  <option [value]="0" disabled>From Location</option>
                  <option *ngFor="let l of locations" [value]="l.id">{{ l.name }}</option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">To Location *</label>
                <select [(ngModel)]="transferForm.toLocationId" name="toLocationId" required class="form-select">
                  <option [value]="0" disabled>To Location</option>
                  <option *ngFor="let l of locations" [value]="l.id">{{ l.name }}</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Transfer Quantity *</label>
              <input type="number" min="1" [(ngModel)]="transferForm.quantity" name="quantity" required placeholder="25" class="form-input" />
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="showTransferModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="gradient-btn-primary px-6 py-2.5 rounded-xl font-bold text-sm">Execute Transfer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class InventoryComponent implements OnInit {
  PlusIcon = Plus;
  MinusIcon = Minus;
  TransferIcon = ArrowRightLeft;
  SearchIcon = Search;
  FilterIcon = Filter;
  AlertIcon = AlertTriangle;
  XIcon = X;
  CheckIcon = Check;
  InventoryIcon = ArrowDownUp;

  inventoryList: Inventory[] = [];
  products: Product[] = [];
  locations: Location[] = [];

  searchQuery = '';
  filterLocationId = 0;
  showOnlyLowStock = false;

  showAddModal = false;
  showRemoveModal = false;
  showTransferModal = false;
  toastMessage = '';

  stockForm = {
    productId: 0,
    locationId: 0,
    quantity: 1
  };

  transferForm = {
    productId: 0,
    fromLocationId: 0,
    toLocationId: 0,
    quantity: 1
  };

  constructor(
    private inventoryService: InventoryService,
    private productService: ProductService,
    private locationService: LocationService
  ) {}

  ngOnInit() {
    this.loadInventory();
    this.loadProductsAndLocations();
  }

  loadInventory() {
    this.inventoryService.getAll().subscribe({
      next: (data) => (this.inventoryList = data || []),
      error: (err) => console.error('Failed to load inventory', err)
    });
  }

  loadProductsAndLocations() {
    this.productService.getAll().subscribe({ next: (data) => (this.products = data || []) });
    this.locationService.getAll().subscribe({ next: (data) => (this.locations = data || []) });
  }

  onLocationFilterChange() {
    if (this.filterLocationId === 0) {
      this.loadInventory();
    } else {
      this.inventoryService.getByLocation(Number(this.filterLocationId)).subscribe({
        next: (data) => (this.inventoryList = data || [])
      });
    }
  }

  toggleLowStockOnly() {
    this.showOnlyLowStock = !this.showOnlyLowStock;
    if (this.showOnlyLowStock) {
      this.inventoryService.getLowStock().subscribe({
        next: (data) => (this.inventoryList = data || [])
      });
    } else {
      this.loadInventory();
    }
  }

  get filteredInventory(): Inventory[] {
    return this.inventoryList.filter(inv => {
      const matchesSearch = 
        !this.searchQuery ||
        inv.product?.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        inv.product?.sku.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        inv.location?.name.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchesSearch;
    });
  }

  openAddModal() {
    this.stockForm = {
      productId: this.products.length > 0 ? this.products[0].id! : 0,
      locationId: this.locations.length > 0 ? this.locations[0].id! : 0,
      quantity: 10
    };
    this.showAddModal = true;
  }

  openRemoveModal() {
    this.stockForm = {
      productId: this.products.length > 0 ? this.products[0].id! : 0,
      locationId: this.locations.length > 0 ? this.locations[0].id! : 0,
      quantity: 5
    };
    this.showRemoveModal = true;
  }

  openTransferModal() {
    this.transferForm = {
      productId: this.products.length > 0 ? this.products[0].id! : 0,
      fromLocationId: this.locations.length > 0 ? this.locations[0].id! : 0,
      toLocationId: this.locations.length > 1 ? this.locations[1].id! : (this.locations.length > 0 ? this.locations[0].id! : 0),
      quantity: 5
    };
    this.showTransferModal = true;
  }

  submitAddStock() {
    if (!this.stockForm.productId || !this.stockForm.locationId || this.stockForm.quantity <= 0) return;

    this.inventoryService.addStock(this.stockForm.productId, this.stockForm.locationId, this.stockForm.quantity).subscribe({
      next: () => {
        this.showAddModal = false;
        this.loadInventory();
        this.showToast('Stock added successfully!');
      },
      error: (err) => alert('Stock addition failed: ' + (err?.error?.message || err?.message))
    });
  }

  submitRemoveStock() {
    if (!this.stockForm.productId || !this.stockForm.locationId || this.stockForm.quantity <= 0) return;

    this.inventoryService.removeStock(this.stockForm.productId, this.stockForm.locationId, this.stockForm.quantity).subscribe({
      next: () => {
        this.showRemoveModal = false;
        this.loadInventory();
        this.showToast('Stock deducted successfully!');
      },
      error: (err) => alert('Stock deduction failed: ' + (err?.error?.message || err?.message))
    });
  }

  submitTransferStock() {
    if (!this.transferForm.productId || !this.transferForm.fromLocationId || !this.transferForm.toLocationId || this.transferForm.quantity <= 0) return;

    if (this.transferForm.fromLocationId === this.transferForm.toLocationId) {
      alert('Source and destination locations must be different');
      return;
    }

    this.inventoryService.transferStock(
      this.transferForm.productId,
      this.transferForm.fromLocationId,
      this.transferForm.toLocationId,
      this.transferForm.quantity
    ).subscribe({
      next: () => {
        this.showTransferModal = false;
        this.loadInventory();
        this.showToast('Stock transferred successfully between locations!');
      },
      error: (err) => alert('Stock transfer failed: ' + (err?.error?.message || err?.message))
    });
  }

  showToast(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => {
      this.toastMessage = '';
    }, 4000);
  }
}
