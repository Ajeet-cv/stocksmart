import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PurchaseService } from '../../services/purchase.service';
import { SupplierService } from '../../services/supplier.service';
import { LocationService } from '../../services/location.service';
import { ProductService } from '../../services/product.service';
import { Purchase } from '../../models/purchase.model';
import { Supplier } from '../../models/supplier.model';
import { Location } from '../../models/location.model';
import { Product } from '../../models/product.model';
import { LucideAngularModule, Plus, ShoppingBag, Search, X, CheckCircle2, DollarSign } from 'lucide-angular';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-white tracking-tight">Purchase Orders & Receiving</h2>
          <p class="text-sm text-slate-400">Receive stock orders from vendor partners and update warehouse inventory</p>
        </div>
        <button (click)="openReceiveModal()" class="gradient-btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Receive Purchase Order
        </button>
      </div>

      <!-- Toast -->
      <div *ngIf="toastMessage" class="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm font-semibold flex items-center justify-between">
        <span>{{ toastMessage }}</span>
        <button (click)="toastMessage = ''" class="text-amber-400 hover:text-white"><lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon></button>
      </div>

      <!-- Purchases History Table -->
      <div class="glass-panel overflow-hidden border-white/10">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>PO ID</th>
                <th>Supplier / Vendor</th>
                <th>Destination Location</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Purchase Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="purchases.length === 0">
                <td colspan="6" class="text-center py-8 text-slate-400">
                  No purchase orders recorded yet. Click "Receive Purchase Order" to log a new inventory receipt.
                </td>
              </tr>
              <tr *ngFor="let p of purchases">
                <td class="font-mono text-xs font-bold text-amber-400">#PO-{{ p.id }}</td>
                <td>
                  <div class="font-bold text-slate-100">{{ p.supplier?.name }}</div>
                  <div class="text-xs text-slate-400">{{ p.supplier?.email || 'No email' }}</div>
                </td>
                <td class="font-semibold text-slate-200">{{ p.location?.name }}</td>
                <td class="font-extrabold text-amber-400 text-base">\${{ p.totalAmount }}</td>
                <td>
                  <span class="badge badge-amber flex items-center gap-1">
                    <lucide-icon [img]="CheckIcon" class="w-3 h-3"></lucide-icon> Received
                  </span>
                </td>
                <td class="text-xs text-slate-400">{{ p.purchaseDate ? (p.purchaseDate | date:'medium') : 'Recent' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Receive Purchase Order Modal -->
      <div *ngIf="showModal" class="modal-overlay">
        <div class="modal-card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              <lucide-icon [img]="ShoppingBagIcon" class="w-5 h-5 text-amber-400"></lucide-icon> Receive Purchase Order
            </h3>
            <button (click)="showModal = false" class="text-slate-400 hover:text-white"><lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon></button>
          </div>

          <form (ngSubmit)="submitReceive()" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Supplier Partner *</label>
              <select [(ngModel)]="form.supplierId" name="supplierId" required class="form-select">
                <option [value]="0" disabled>Select Supplier</option>
                <option *ngFor="let s of suppliers" [value]="s.id">{{ s.name }}</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Destination Location *</label>
              <select [(ngModel)]="form.locationId" name="locationId" required class="form-select">
                <option [value]="0" disabled>Select Warehouse / Location</option>
                <option *ngFor="let l of locations" [value]="l.id">{{ l.name }} ({{ l.type }})</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Product to Receive *</label>
              <select [(ngModel)]="form.productId" name="productId" required class="form-select">
                <option [value]="0" disabled>Select Product</option>
                <option *ngFor="let prod of products" [value]="prod.id">{{ prod.name }} (SKU: {{ prod.sku }})</option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Quantity Received *</label>
                <input type="number" min="1" [(ngModel)]="form.quantity" name="quantity" required placeholder="100" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Unit Cost ($) *</label>
                <input type="number" step="0.01" min="0" [(ngModel)]="form.unitCost" name="unitCost" required placeholder="25.00" class="form-input" />
              </div>
            </div>

            <div class="p-4 rounded-xl bg-slate-900 border border-white/10 flex justify-between items-center text-sm">
              <span class="text-slate-400">Total Purchase Value:</span>
              <strong class="text-amber-400 font-extrabold text-lg">\${{ (form.quantity * form.unitCost).toFixed(2) }}</strong>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="showModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="gradient-btn-primary px-6 py-2.5 rounded-xl font-bold text-sm">Receive & Update Stock</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class PurchasesComponent implements OnInit {
  PlusIcon = Plus;
  ShoppingBagIcon = ShoppingBag;
  SearchIcon = Search;
  XIcon = X;
  CheckIcon = CheckCircle2;
  DollarIcon = DollarSign;

  purchases: Purchase[] = [];
  suppliers: Supplier[] = [];
  locations: Location[] = [];
  products: Product[] = [];

  showModal = false;
  toastMessage = '';

  form = {
    supplierId: 0,
    locationId: 0,
    productId: 0,
    quantity: 10,
    unitCost: 15.00
  };

  constructor(
    private purchaseService: PurchaseService,
    private supplierService: SupplierService,
    private locationService: LocationService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadPurchases();
    this.loadDependencies();
  }

  loadPurchases() {
    this.purchaseService.getAll().subscribe({
      next: (data) => (this.purchases = data || [])
    });
  }

  loadDependencies() {
    this.supplierService.getAll().subscribe({ next: (data) => (this.suppliers = data || []) });
    this.locationService.getAll().subscribe({ next: (data) => (this.locations = data || []) });
    this.productService.getAll().subscribe({ next: (data) => (this.products = data || []) });
  }

  openReceiveModal() {
    this.form = {
      supplierId: this.suppliers.length > 0 ? this.suppliers[0].id! : 0,
      locationId: this.locations.length > 0 ? this.locations[0].id! : 0,
      productId: this.products.length > 0 ? this.products[0].id! : 0,
      quantity: 50,
      unitCost: 20.00
    };
    this.showModal = true;
  }

  submitReceive() {
    if (!this.form.supplierId || !this.form.locationId || !this.form.productId || this.form.quantity <= 0) return;

    this.purchaseService.receive(
      this.form.supplierId,
      this.form.locationId,
      this.form.productId,
      this.form.quantity,
      this.form.unitCost
    ).subscribe({
      next: () => {
        this.showModal = false;
        this.loadPurchases();
        this.toastMessage = 'Purchase order received & inventory increased successfully!';
        setTimeout(() => (this.toastMessage = ''), 4000);
      },
      error: (err) => alert('Failed to receive purchase order: ' + (err?.error?.message || err?.message))
    });
  }
}
