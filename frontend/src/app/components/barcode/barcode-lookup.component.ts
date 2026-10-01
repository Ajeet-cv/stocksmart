import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { InventoryService } from '../../services/inventory.service';
import { Product } from '../../models/product.model';
import { Inventory } from '../../models/inventory.model';
import { LucideAngularModule, Barcode, Search, AlertCircle, CheckCircle2, Package, Layers, MapPin, DollarSign, ArrowRight, RefreshCw } from 'lucide-angular';

@Component({
  selector: 'app-barcode-lookup',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in font-sans">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Barcode Scanner & Product Lookup</h2>
          <p class="text-sm text-slate-500 font-medium">Instantly scan or input barcodes to verify item details, pricing, and stock locations</p>
        </div>
        <div class="flex items-center gap-2 text-xs font-semibold text-blue-700 bg-blue-50 px-3.5 py-2 rounded-xl border border-blue-200">
          <lucide-icon [img]="BarcodeIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
          <span>Real-time Barcode Engine</span>
        </div>
      </div>

      <!-- Scanner Search Box -->
      <div class="glass-panel p-6 border-slate-200 bg-white">
        <label class="block text-xs font-extrabold uppercase tracking-wider text-slate-700 mb-2">Scan or Type Barcode / SKU</label>
        <div class="flex flex-col sm:flex-row items-center gap-3">
          <div class="relative w-full flex-1">
            <lucide-icon [img]="BarcodeIcon" class="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2"></lucide-icon>
            <input 
              type="text" 
              [(ngModel)]="searchBarcode" 
              (keyup.enter)="performLookup()"
              placeholder="e.g. 890100000001 or ELEC-001..." 
              class="w-full bg-slate-50 border border-slate-300 rounded-xl pl-12 pr-4 py-3 text-base text-slate-900 font-mono font-bold placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <button (click)="performLookup()" class="w-full sm:w-auto gradient-btn-primary px-8 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
            <lucide-icon [img]="SearchIcon" class="w-4 h-4"></lucide-icon>
            <span>Scan & Lookup</span>
          </button>
        </div>

        <!-- Sample Barcode Quick Tags -->
        <div class="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
          <span class="text-slate-500 font-semibold">Quick Sample Barcodes:</span>
          <button 
            *ngFor="let sample of sampleBarcodes" 
            (click)="quickLookup(sample)"
            class="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-200 border border-slate-200 font-mono transition-all font-semibold"
          >
            {{ sample }}
          </button>
        </div>
      </div>

      <!-- Search Error / Not Found Banner -->
      <div *ngIf="errorMessage" class="p-6 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-4">
        <div class="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center flex-shrink-0">
          <lucide-icon [img]="AlertIcon" class="w-5 h-5"></lucide-icon>
        </div>
        <div>
          <h4 class="font-bold text-base text-rose-900">Barcode Not Found</h4>
          <p class="text-sm mt-0.5 text-rose-700">{{ errorMessage }}</p>
        </div>
      </div>

      <!-- Scanned Product Detail Card -->
      <div *ngIf="scannedProduct" class="glass-panel p-6 border-blue-200 bg-gradient-to-br from-white to-blue-50/30 space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-5">
          <div class="flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 flex-shrink-0">
              <lucide-icon [img]="PackageIcon" class="w-7 h-7"></lucide-icon>
            </div>
            <div>
              <div class="flex items-center gap-2">
                <span class="badge badge-indigo">{{ scannedProduct.category?.name || 'General' }}</span>
                <span class="font-mono text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">SKU: {{ scannedProduct.sku }}</span>
              </div>
              <h3 class="text-2xl font-extrabold text-slate-900 mt-1">{{ scannedProduct.name }}</h3>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <div class="text-right">
              <div class="text-xs text-slate-500 font-bold uppercase">Unit Price</div>
              <div class="text-2xl font-black text-emerald-600">\${{ scannedProduct.price }}</div>
            </div>
          </div>
        </div>

        <!-- Metric Details Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="p-4 rounded-xl bg-white border border-slate-200">
            <div class="text-xs font-bold text-slate-500 uppercase">Barcode Tag</div>
            <div class="text-base font-mono font-extrabold text-slate-900 mt-1 flex items-center gap-2">
              <lucide-icon [img]="BarcodeIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
              <span>{{ scannedProduct.barcode || 'N/A' }}</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white border border-slate-200">
            <div class="text-xs font-bold text-slate-500 uppercase">Total System Stock</div>
            <div class="text-base font-extrabold mt-1" [class.text-amber-600]="(scannedProduct.quantity || 0) <= (scannedProduct.reorderLevel || 10)" [class.text-emerald-600]="(scannedProduct.quantity || 0) > (scannedProduct.reorderLevel || 10)">
              {{ scannedProduct.quantity || 0 }} units
            </div>
          </div>

          <div class="p-4 rounded-xl bg-white border border-slate-200">
            <div class="text-xs font-bold text-slate-500 uppercase">Reorder Point</div>
            <div class="text-base font-extrabold text-slate-700 mt-1">
              {{ scannedProduct.reorderLevel || 10 }} units
            </div>
          </div>
        </div>

        <div class="p-4 rounded-xl bg-white border border-slate-200">
          <h4 class="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-1">Product Description</h4>
          <p class="text-sm text-slate-700 font-medium leading-relaxed">{{ scannedProduct.description || 'No detailed description registered for this barcode.' }}</p>
        </div>

        <!-- Inventory Location Breakdown Table -->
        <div *ngIf="productInventoryList.length > 0" class="space-y-3">
          <h4 class="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <lucide-icon [img]="MapPinIcon" class="w-4 h-4 text-blue-600"></lucide-icon> Stock Location Distribution
          </h4>
          <div class="glass-panel overflow-hidden border-slate-200 bg-white">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Location Warehouse</th>
                  <th>Location Type</th>
                  <th>Quantity On Hand</th>
                  <th>Stock Status</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let inv of productInventoryList">
                  <td class="font-bold text-slate-900">{{ inv.location?.name }}</td>
                  <td><span class="badge badge-indigo">{{ inv.location?.type || 'Warehouse' }}</span></td>
                  <td class="font-extrabold text-slate-900">{{ inv.quantity }} units</td>
                  <td>
                    <span *ngIf="inv.quantity <= (scannedProduct.reorderLevel || 10)" class="badge badge-amber">Low Stock</span>
                    <span *ngIf="inv.quantity > (scannedProduct.reorderLevel || 10)" class="badge badge-emerald">In Stock</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class BarcodeLookupComponent implements OnInit {
  BarcodeIcon = Barcode;
  SearchIcon = Search;
  AlertIcon = AlertCircle;
  CheckIcon = CheckCircle2;
  PackageIcon = Package;
  LayersIcon = Layers;
  MapPinIcon = MapPin;
  DollarIcon = DollarSign;
  ArrowIcon = ArrowRight;
  RefreshIcon = RefreshCw;

  searchBarcode = '890100000001';
  scannedProduct: Product | null = null;
  productInventoryList: Inventory[] = [];
  errorMessage = '';

  sampleBarcodes = [
    '890100000001',
    '890100000002',
    '890100000003',
    '890100000004',
    '890100000005',
    '890100000006',
    'ELEC-001',
    'CLOT-001'
  ];

  constructor(
    private productService: ProductService,
    private inventoryService: InventoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.performLookup();
  }

  quickLookup(code: string) {
    this.searchBarcode = code;
    this.performLookup();
  }

  performLookup() {
    if (!this.searchBarcode.trim()) return;

    this.errorMessage = '';
    this.scannedProduct = null;
    this.productInventoryList = [];

    const query = this.searchBarcode.trim();

    // First try lookup by barcode endpoint
    this.productService.getByBarcode(query).subscribe({
      next: (prod) => {
        if (prod) {
          this.scannedProduct = prod;
          this.loadProductInventory(prod.id!);
        } else {
          this.fallbackSearchBySkuOrAll(query);
        }
        this.cdr.detectChanges();
      },
      error: () => {
        // If 404 on barcode endpoint, fallback to search across catalog by SKU or Barcode matching
        this.fallbackSearchBySkuOrAll(query);
      }
    });
  }

  private fallbackSearchBySkuOrAll(query: string) {
    this.productService.getAll().subscribe({
      next: (products) => {
        const found = products.find(p => 
          p.sku.toLowerCase() === query.toLowerCase() || 
          (p.barcode && p.barcode.toLowerCase() === query.toLowerCase())
        );

        if (found) {
          this.scannedProduct = found;
          this.loadProductInventory(found.id!);
        } else {
          this.errorMessage = `No registered product matched barcode or SKU code "${query}".`;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.errorMessage = 'Unable to connect to inventory backend service.';
        this.cdr.detectChanges();
      }
    });
  }

  private loadProductInventory(productId: number) {
    this.inventoryService.getByProduct(productId).subscribe({
      next: (inv) => {
        this.productInventoryList = inv || [];
        this.cdr.detectChanges();
      }
    });
  }
}
