import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SaleService } from '../../services/sale.service';
import { LocationService } from '../../services/location.service';
import { ProductService } from '../../services/product.service';
import { Sale } from '../../models/sale.model';
import { Location } from '../../models/location.model';
import { Product } from '../../models/product.model';
import { LucideAngularModule, Plus, ShoppingCart, Search, X, CheckCircle2, User, DollarSign } from 'lucide-angular';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-white tracking-tight">Sales Orders & Point of Sale</h2>
          <p class="text-sm text-slate-400">Process customer sales, fulfill orders, and automatically adjust stock levels</p>
        </div>
        <button (click)="openCreateSaleModal()" class="gradient-btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> New Sale Order
        </button>
      </div>

      <!-- Toast -->
      <div *ngIf="toastMessage" class="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-sm font-semibold flex items-center justify-between">
        <span>{{ toastMessage }}</span>
        <button (click)="toastMessage = ''" class="text-emerald-400 hover:text-white"><lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon></button>
      </div>

      <!-- Sales History Data Table -->
      <div class="glass-panel overflow-hidden border-white/10">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer Name</th>
                <th>Fulfillment Location</th>
                <th>Total Revenue</th>
                <th>Status</th>
                <th>Sale Date</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="sales.length === 0">
                <td colspan="6" class="text-center py-8 text-slate-400">
                  No sales orders recorded yet. Click "New Sale Order" to record a transaction.
                </td>
              </tr>
              <tr *ngFor="let s of sales">
                <td class="font-mono text-xs font-bold text-indigo-400">#ORD-{{ s.id }}</td>
                <td>
                  <div class="font-bold text-slate-100">{{ s.customerName }}</div>
                </td>
                <td class="font-semibold text-slate-200">{{ s.location?.name }}</td>
                <td class="font-extrabold text-emerald-400 text-base">\${{ s.totalAmount }}</td>
                <td>
                  <span class="badge badge-emerald flex items-center gap-1">
                    <lucide-icon [img]="CheckIcon" class="w-3 h-3"></lucide-icon> Completed
                  </span>
                </td>
                <td class="text-xs text-slate-400">{{ s.saleDate ? (s.saleDate | date:'medium') : 'Recent' }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Create Sale Modal -->
      <div *ngIf="showModal" class="modal-overlay">
        <div class="modal-card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white flex items-center gap-2">
              <lucide-icon [img]="ShoppingCartIcon" class="w-5 h-5 text-emerald-400"></lucide-icon> Create New Sale Order
            </h3>
            <button (click)="showModal = false" class="text-slate-400 hover:text-white"><lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon></button>
          </div>

          <form (ngSubmit)="submitCreateSale()" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Customer Name *</label>
              <input type="text" [(ngModel)]="form.customerName" name="customerName" required placeholder="Acme Corp / Jane Smith" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Fulfillment Location *</label>
              <select [(ngModel)]="form.locationId" name="locationId" required class="form-select">
                <option [value]="0" disabled>Select Warehouse / Store</option>
                <option *ngFor="let l of locations" [value]="l.id">{{ l.name }} ({{ l.type }})</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Product Sold *</label>
              <select [(ngModel)]="form.productId" (change)="onProductSelectChange()" name="productId" required class="form-select">
                <option [value]="0" disabled>Select Product</option>
                <option *ngFor="let prod of products" [value]="prod.id">{{ prod.name }} (\${{ prod.price }})</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Quantity Sold *</label>
              <input type="number" min="1" [(ngModel)]="form.quantity" name="quantity" required placeholder="1" class="form-input" />
            </div>

            <div class="p-4 rounded-xl bg-slate-900 border border-white/10 flex justify-between items-center text-sm">
              <span class="text-slate-400">Order Estimated Total:</span>
              <strong class="text-emerald-400 font-extrabold text-lg">\${{ calculateTotal().toFixed(2) }}</strong>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="showModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="gradient-btn-primary px-6 py-2.5 rounded-xl font-bold text-sm">Fulfill Sale Order</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `
})
export class SalesComponent implements OnInit {
  PlusIcon = Plus;
  ShoppingCartIcon = ShoppingCart;
  SearchIcon = Search;
  XIcon = X;
  CheckIcon = CheckCircle2;
  UserIcon = User;
  DollarIcon = DollarSign;

  sales: Sale[] = [];
  locations: Location[] = [];
  products: Product[] = [];

  showModal = false;
  toastMessage = '';
  selectedProductPrice = 0;

  form = {
    customerName: '',
    locationId: 0,
    productId: 0,
    quantity: 1
  };

  constructor(
    private saleService: SaleService,
    private locationService: LocationService,
    private productService: ProductService
  ) {}

  ngOnInit() {
    this.loadSales();
    this.loadDependencies();
  }

  loadSales() {
    this.saleService.getAll().subscribe({
      next: (data) => (this.sales = data || [])
    });
  }

  loadDependencies() {
    this.locationService.getAll().subscribe({ next: (data) => (this.locations = data || []) });
    this.productService.getAll().subscribe({ next: (data) => (this.products = data || []) });
  }

  openCreateSaleModal() {
    const firstProd = this.products.length > 0 ? this.products[0] : null;
    this.form = {
      customerName: '',
      locationId: this.locations.length > 0 ? this.locations[0].id! : 0,
      productId: firstProd ? firstProd.id! : 0,
      quantity: 1
    };
    this.selectedProductPrice = firstProd ? firstProd.price : 0;
    this.showModal = true;
  }

  onProductSelectChange() {
    const found = this.products.find(p => p.id === Number(this.form.productId));
    if (found) {
      this.selectedProductPrice = found.price;
    }
  }

  calculateTotal(): number {
    return (this.form.quantity || 1) * (this.selectedProductPrice || 0);
  }

  submitCreateSale() {
    if (!this.form.customerName || !this.form.locationId || !this.form.productId || this.form.quantity <= 0) return;

    this.saleService.createSale(
      this.form.customerName,
      this.form.productId,
      this.form.locationId,
      this.form.quantity
    ).subscribe({
      next: () => {
        this.showModal = false;
        this.loadSales();
        this.toastMessage = 'Sale order created & inventory deducted successfully!';
        setTimeout(() => (this.toastMessage = ''), 4000);
      },
      error: (err) => alert('Failed to create sale order: ' + (err?.error?.message || err?.message))
    });
  }
}
