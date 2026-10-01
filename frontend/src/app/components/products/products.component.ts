import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { Product, ProductRequest } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { LucideAngularModule, Plus, Search, Edit3, Trash2, Barcode, Filter, X, Check, Package } from 'lucide-angular';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <!-- Header Bar -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-900 tracking-tight">Product Catalog</h2>
          <p class="text-sm text-slate-500 font-medium">Manage inventory products, SKUs, pricing, and reorder levels</p>
        </div>
        <button (click)="openAddModal()" class="gradient-btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add New Product
        </button>
      </div>

      <!-- Filters & Controls -->
      <div class="glass-panel p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div class="relative w-full md:w-96">
          <lucide-icon [img]="SearchIcon" class="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></lucide-icon>
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            placeholder="Search by name, SKU or barcode..." 
            class="form-input pl-10 py-2 text-sm"
          />
        </div>

        <div class="flex items-center gap-3 w-full md:w-auto">
          <div class="flex items-center gap-2">
            <lucide-icon [img]="FilterIcon" class="w-4 h-4 text-slate-400"></lucide-icon>
            <select [(ngModel)]="selectedCategoryId" class="form-select py-2 text-sm">
              <option [value]="0">All Categories</option>
              <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
            </select>
          </div>
          <span class="text-xs text-slate-500 font-semibold whitespace-nowrap">{{ filteredProducts.length }} Products</span>
        </div>
      </div>

      <!-- Notification Toast -->
      <div *ngIf="toastMessage" class="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-800 text-sm font-semibold flex items-center justify-between">
        <span>{{ toastMessage }}</span>
        <button (click)="toastMessage = ''" class="text-blue-600 hover:text-blue-900"><lucide-icon [img]="XIcon" class="w-4 h-4"></lucide-icon></button>
      </div>

      <!-- Products Data Table -->
      <div class="glass-panel overflow-hidden border-slate-200">
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Barcode</th>
                <th>Category</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Reorder Level</th>
                <th class="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngIf="filteredProducts.length === 0">
                <td colspan="8" class="text-center py-8 text-slate-500">
                  No products found. Click "Add New Product" to create one.
                </td>
              </tr>
              <tr *ngFor="let prod of filteredProducts">
                <td class="font-mono text-xs font-bold text-blue-600">{{ prod.sku }}</td>
                <td>
                  <div class="font-bold text-slate-900">{{ prod.name }}</div>
                  <div class="text-xs text-slate-500 truncate max-w-xs">{{ prod.description || 'No description' }}</div>
                </td>
                <td class="text-slate-600 font-mono text-xs">{{ prod.barcode || '—' }}</td>
                <td>
                  <span class="badge badge-indigo">{{ prod.category?.name || 'Uncategorized' }}</span>
                </td>
                <td class="font-bold text-emerald-600">\${{ prod.price }}</td>
                <td>
                  <span [class.badge-amber]="(prod.quantity || 0) <= (prod.reorderLevel || 10)"
                        [class.badge-emerald]="(prod.quantity || 0) > (prod.reorderLevel || 10)"
                        class="badge">
                    {{ prod.quantity || 0 }} units
                  </span>
                </td>
                <td class="text-slate-500 text-xs font-medium">{{ prod.reorderLevel || 10 }} units</td>
                <td class="text-right space-x-2">
                  <button (click)="openEditModal(prod)" class="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all">
                    <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                  <button (click)="confirmDelete(prod)" class="p-2 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all">
                    <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Add / Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay">
        <div class="modal-card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-slate-900">{{ isEditing ? 'Edit Product' : 'Add New Product' }}</h3>
            <button (click)="closeModal()" class="text-slate-400 hover:text-slate-700"><lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon></button>
          </div>

          <form (ngSubmit)="saveProduct()" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">SKU Code *</label>
                <input type="text" [(ngModel)]="formData.sku" name="sku" required placeholder="SKU-1001" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Barcode</label>
                <input type="text" [(ngModel)]="formData.barcode" name="barcode" placeholder="890123456789" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Product Name *</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required placeholder="Wireless Keyboard Pro" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Category *</label>
              <select [(ngModel)]="formData.categoryId" name="categoryId" required class="form-select">
                <option [value]="null" disabled>Select category</option>
                <option *ngFor="let cat of categories" [value]="cat.id">{{ cat.name }}</option>
              </select>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="form-group">
                <label class="form-label">Price ($) *</label>
                <input type="number" step="0.01" [(ngModel)]="formData.price" name="price" required placeholder="49.99" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Initial Quantity</label>
                <input type="number" [(ngModel)]="formData.quantity" name="quantity" placeholder="50" class="form-input" />
              </div>
              <div class="form-group">
                <label class="form-label">Reorder Level</label>
                <input type="number" [(ngModel)]="formData.reorderLevel" name="reorderLevel" placeholder="10" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea [(ngModel)]="formData.description" name="description" rows="2" placeholder="Product details..." class="form-textarea"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-slate-200">
              <button type="button" (click)="closeModal()" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="gradient-btn-primary px-6 py-2.5 rounded-xl font-bold text-sm">
                {{ isEditing ? 'Update Product' : 'Create Product' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay">
        <div class="modal-card max-w-md">
          <h3 class="text-xl font-bold text-slate-900 mb-2">Delete Product</h3>
          <p class="text-sm text-slate-600 mb-6">Are you sure you want to delete <strong class="text-slate-900">{{ selectedProduct?.name }}</strong>? This action cannot be undone.</p>
          <div class="flex justify-end gap-3">
            <button (click)="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
            <button (click)="deleteProduct()" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProductsComponent implements OnInit {
  PlusIcon = Plus;
  SearchIcon = Search;
  EditIcon = Edit3;
  TrashIcon = Trash2;
  BarcodeIcon = Barcode;
  FilterIcon = Filter;
  XIcon = X;

  products: Product[] = [];
  categories: Category[] = [];

  searchQuery = '';
  selectedCategoryId = 0;

  showModal = false;
  isEditing = false;
  editingId: number | null = null;

  showDeleteModal = false;
  selectedProduct: Product | null = null;
  toastMessage = '';

  formData: ProductRequest = {
    sku: '',
    barcode: '',
    name: '',
    description: '',
    categoryId: 0,
    price: 0,
    quantity: 0,
    reorderLevel: 10
  };

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts() {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data || [];
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load products', err)
    });
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => {
        this.categories = data || [];
        if (this.categories.length > 0 && !this.formData.categoryId) {
          this.formData.categoryId = this.categories[0].id!;
        }
        this.cdr.detectChanges();
      }
    });
  }

  get filteredProducts(): Product[] {
    return this.products.filter(p => {
      const matchesSearch = 
        !this.searchQuery ||
        p.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        (p.barcode && p.barcode.includes(this.searchQuery));

      const matchesCat = 
        this.selectedCategoryId === 0 || 
        (p.category && p.category.id === Number(this.selectedCategoryId));

      return matchesSearch && matchesCat;
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.editingId = null;
    this.formData = {
      sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
      barcode: '',
      name: '',
      description: '',
      categoryId: this.categories.length > 0 ? this.categories[0].id! : 0,
      price: 0,
      quantity: 10,
      reorderLevel: 10
    };
    this.showModal = true;
  }

  openEditModal(p: Product) {
    this.isEditing = true;
    this.editingId = p.id!;
    this.formData = {
      sku: p.sku,
      barcode: p.barcode || '',
      name: p.name,
      description: p.description || '',
      categoryId: p.category ? p.category.id! : (this.categories.length > 0 ? this.categories[0].id! : 0),
      price: p.price,
      quantity: p.quantity || 0,
      reorderLevel: p.reorderLevel || 10
    };
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  saveProduct() {
    if (!this.formData.sku || !this.formData.name || !this.formData.categoryId) {
      alert('Please fill out all required fields');
      return;
    }

    if (this.isEditing && this.editingId) {
      this.productService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadProducts();
          this.showToast('Product updated successfully!');
        },
        error: (err) => alert('Failed to update product: ' + (err?.error?.message || err?.message))
      });
    } else {
      this.productService.create(this.formData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadProducts();
          this.showToast('Product created successfully!');
        },
        error: (err) => alert('Failed to create product: ' + (err?.error?.message || err?.message))
      });
    }
  }

  confirmDelete(p: Product) {
    this.selectedProduct = p;
    this.showDeleteModal = true;
  }

  deleteProduct() {
    if (!this.selectedProduct?.id) return;
    this.productService.delete(this.selectedProduct.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.loadProducts();
        this.showToast('Product deleted successfully');
      },
      error: () => alert('Failed to delete product')
    });
  }

  showToast(msg: string) {
    this.toastMessage = msg;
    setTimeout(() => {
      this.toastMessage = '';
    }, 4000);
  }
}
