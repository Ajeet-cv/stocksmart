import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportService } from '../../services/report.service';
import { ProductService } from '../../services/product.service';
import { SaleService } from '../../services/sale.service';
import { PurchaseService } from '../../services/purchase.service';
import { DashboardMetrics } from '../../models/dashboard.model';
import { Product } from '../../models/product.model';
import { Sale } from '../../models/sale.model';
import { Purchase } from '../../models/purchase.model';
import { LucideAngularModule, BarChart3, TrendingUp, DollarSign, Package, ShoppingCart, ShoppingBag, ArrowUpRight, ArrowDownRight, Layers, Download } from 'lucide-angular';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in font-sans">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Business Reports & Analytics</h2>
          <p class="text-sm text-slate-500 font-medium">Real-time revenue, purchasing, stock valuation, and category distribution reports</p>
        </div>
        <div class="flex items-center gap-3">
          <button (click)="exportToCSV()" class="btn btn-secondary text-xs flex items-center gap-2 border-slate-300 hover:bg-slate-100 font-bold px-4 py-2.5 rounded-xl shadow-xs">
            <lucide-icon [img]="DownloadIcon" class="w-4 h-4 text-slate-700"></lucide-icon>
            <span>Export CSV Report</span>
          </button>
          <div class="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3.5 py-2 rounded-xl border border-slate-200 shadow-xs">
            <lucide-icon [img]="BarChartIcon" class="w-4 h-4 text-blue-600"></lucide-icon>
            <span>Live Insights</span>
          </div>
        </div>
      </div>

      <!-- Stat KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- Sales Revenue -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Sales Revenue</p>
            <h3 class="text-2xl font-extrabold text-slate-900 mt-1">\${{ totalSalesRevenue.toFixed(2) }}</h3>
            <p class="text-[11px] font-semibold text-emerald-600 flex items-center gap-0.5 mt-1">
              <lucide-icon [img]="ArrowUpIcon" class="w-3 h-3"></lucide-icon> {{ salesList.length }} Completed Sales
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <lucide-icon [img]="DollarIcon" class="w-6 h-6"></lucide-icon>
          </div>
        </div>

        <!-- Procurement Spend -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Purchase Expenditures</p>
            <h3 class="text-2xl font-extrabold text-slate-900 mt-1">\${{ totalPurchaseSpend.toFixed(2) }}</h3>
            <p class="text-[11px] font-semibold text-blue-600 flex items-center gap-0.5 mt-1">
              <lucide-icon [img]="BagIcon" class="w-3 h-3"></lucide-icon> {{ purchasesList.length }} Orders Received
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <lucide-icon [img]="BagIcon" class="w-6 h-6"></lucide-icon>
          </div>
        </div>

        <!-- Inventory Valuation -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Stock Valuation</p>
            <h3 class="text-2xl font-extrabold text-slate-900 mt-1">\${{ totalInventoryValue.toFixed(2) }}</h3>
            <p class="text-[11px] font-semibold text-purple-600 flex items-center gap-0.5 mt-1">
              <lucide-icon [img]="PackageIcon" class="w-3 h-3"></lucide-icon> {{ productsList.length }} Active Catalog SKUs
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <lucide-icon [img]="TrendingUpIcon" class="w-6 h-6"></lucide-icon>
          </div>
        </div>

        <!-- Net Profit Margin -->
        <div class="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p class="text-xs font-bold text-slate-500 uppercase tracking-wider">Net Sales Balance</p>
            <h3 class="text-2xl font-extrabold text-slate-900 mt-1">\${{ (totalSalesRevenue - totalPurchaseSpend).toFixed(2) }}</h3>
            <p class="text-[11px] font-semibold" [class.text-emerald-600]="(totalSalesRevenue - totalPurchaseSpend) >= 0" [class.text-rose-600]="(totalSalesRevenue - totalPurchaseSpend) < 0">
              {{ (totalSalesRevenue - totalPurchaseSpend) >= 0 ? '+ Positive Revenue' : '- Net Expenditure' }}
            </p>
          </div>
          <div class="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <lucide-icon [img]="BarChartIcon" class="w-6 h-6"></lucide-icon>
          </div>
        </div>
      </div>

      <!-- Report Tables -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Sales Transactions Report -->
        <div class="glass-panel p-6 border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <lucide-icon [img]="CartIcon" class="w-5 h-5 text-emerald-600"></lucide-icon> Sales Transactions Summary
            </h3>
            <span class="text-xs text-slate-500 font-semibold">{{ salesList.length }} Orders</span>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="salesList.length === 0">
                  <td colspan="4" class="text-center py-6 text-slate-500">No sales transactions logged.</td>
                </tr>
                <tr *ngFor="let s of salesList.slice(0, 5)">
                  <td class="font-mono text-xs font-bold text-blue-600">#ORD-{{ s.id }}</td>
                  <td class="font-semibold text-slate-900">{{ s.customerName }}</td>
                  <td class="font-extrabold text-emerald-600">\${{ s.totalAmount }}</td>
                  <td class="text-xs text-slate-500">{{ s.saleDate ? (s.saleDate | date:'short') : 'Recent' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Procurement Orders Report -->
        <div class="glass-panel p-6 border-slate-200">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">
              <lucide-icon [img]="BagIcon" class="w-5 h-5 text-blue-600"></lucide-icon> Supplier Purchase Receipts
            </h3>
            <span class="text-xs text-slate-500 font-semibold">{{ purchasesList.length }} Receipts</span>
          </div>

          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>PO #</th>
                  <th>Supplier</th>
                  <th>Amount</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngIf="purchasesList.length === 0">
                  <td colspan="4" class="text-center py-6 text-slate-500">No purchase receipts logged.</td>
                </tr>
                <tr *ngFor="let p of purchasesList.slice(0, 5)">
                  <td class="font-mono text-xs font-bold text-blue-600">#PO-{{ p.id }}</td>
                  <td class="font-semibold text-slate-900">{{ p.supplier?.name || 'Vendor' }}</td>
                  <td class="font-extrabold text-slate-900">\${{ p.totalAmount }}</td>
                  <td class="text-xs text-slate-500">{{ p.purchaseDate ? (p.purchaseDate | date:'short') : 'Recent' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ReportsComponent implements OnInit {
  BarChartIcon = BarChart3;
  TrendingUpIcon = TrendingUp;
  DollarIcon = DollarSign;
  PackageIcon = Package;
  CartIcon = ShoppingCart;
  BagIcon = ShoppingBag;
  ArrowUpIcon = ArrowUpRight;
  ArrowDownIcon = ArrowDownRight;
  LayersIcon = Layers;
  DownloadIcon = Download;

  productsList: Product[] = [];
  salesList: Sale[] = [];
  purchasesList: Purchase[] = [];

  totalSalesRevenue = 0;
  totalPurchaseSpend = 0;
  totalInventoryValue = 0;

  constructor(
    private reportService: ReportService,
    private productService: ProductService,
    private saleService: SaleService,
    private purchaseService: PurchaseService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.saleService.getAll().subscribe({
      next: (data) => {
        this.salesList = data || [];
        this.totalSalesRevenue = this.salesList.reduce((sum, s) => sum + (s.totalAmount || 0), 0);
        this.cdr.detectChanges();
      }
    });

    this.purchaseService.getAll().subscribe({
      next: (data) => {
        this.purchasesList = data || [];
        this.totalPurchaseSpend = this.purchasesList.reduce((sum, p) => sum + (p.totalAmount || 0), 0);
        this.cdr.detectChanges();
      }
    });

    this.productService.getAll().subscribe({
      next: (data) => {
        this.productsList = data || [];
        this.totalInventoryValue = this.productsList.reduce((sum, p) => sum + ((p.price || 0) * (p.quantity || 0)), 0);
        this.cdr.detectChanges();
      }
    });
  }

  exportToCSV() {
    const headers = ['Record Type', 'Order/PO ID', 'Customer/Supplier Name', 'Total Amount ($)', 'Transaction Date'];
    const rows: string[][] = [];

    this.salesList.forEach(s => {
      rows.push(['Sales Order', `ORD-${s.id}`, `"${s.customerName}"`, (s.totalAmount || 0).toString(), `"${s.saleDate || 'Recent'}"`]);
    });

    this.purchasesList.forEach(p => {
      rows.push(['Purchase Order', `PO-${p.id}`, `"${p.supplier?.name || 'Vendor'}"`, (p.totalAmount || 0).toString(), `"${p.purchaseDate || 'Recent'}"`]);
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `StockSmart_Business_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
