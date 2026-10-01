import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupplierService } from '../../services/supplier.service';
import { Supplier, SupplierRequest } from '../../models/supplier.model';
import { LucideAngularModule, Plus, Search, Edit3, Trash2, Users, Mail, Phone, MapPin, X } from 'lucide-angular';

@Component({
  selector: 'app-suppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-white tracking-tight">Suppliers & Vendors</h2>
          <p class="text-sm text-slate-400">Manage supplier profiles, contact details, and procurement partners</p>
        </div>
        <button (click)="openAddModal()" class="gradient-btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add New Supplier
        </button>
      </div>

      <!-- Suppliers Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let sup of suppliers" class="glass-panel p-6 glass-panel-hover flex flex-col justify-between border-white/10">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-lg">
                {{ sup.name.charAt(0).toUpperCase() }}
              </div>
              <div class="flex gap-2">
                <button (click)="openEditModal(sup)" class="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all">
                  <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                </button>
                <button (click)="confirmDelete(sup)" class="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all">
                  <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>

            <h3 class="text-lg font-bold text-white mb-3">{{ sup.name }}</h3>

            <div class="space-y-2 text-sm text-slate-300">
              <div *ngIf="sup.email" class="flex items-center gap-2">
                <lucide-icon [img]="MailIcon" class="w-4 h-4 text-cyan-400 flex-shrink-0"></lucide-icon>
                <a [href]="'mailto:' + sup.email" class="hover:text-cyan-300 truncate">{{ sup.email }}</a>
              </div>
              <div *ngIf="sup.phone" class="flex items-center gap-2">
                <lucide-icon [img]="PhoneIcon" class="w-4 h-4 text-emerald-400 flex-shrink-0"></lucide-icon>
                <a [href]="'tel:' + sup.phone" class="hover:text-emerald-300">{{ sup.phone }}</a>
              </div>
              <div *ngIf="sup.address" class="flex items-start gap-2">
                <lucide-icon [img]="MapPinIcon" class="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5"></lucide-icon>
                <span class="text-slate-400 text-xs">{{ sup.address }}</span>
              </div>
            </div>
          </div>

          <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Vendor ID: #{{ sup.id }}</span>
            <span class="badge badge-cyan">Active Partner</span>
          </div>
        </div>
      </div>

      <!-- Add / Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay">
        <div class="modal-card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white">{{ isEditing ? 'Edit Supplier' : 'Add Supplier' }}</h3>
            <button (click)="showModal = false" class="text-slate-400 hover:text-white"><lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon></button>
          </div>

          <form (ngSubmit)="saveSupplier()" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Supplier / Vendor Name *</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required placeholder="Acme Logistics Inc." class="form-input" />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" [(ngModel)]="formData.email" name="email" placeholder="orders@acme.com" class="form-input" />
              </div>

              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="text" [(ngModel)]="formData.phone" name="phone" placeholder="+1 (555) 019-2834" class="form-input" />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">Address</label>
              <textarea [(ngModel)]="formData.address" name="address" rows="2" placeholder="742 Evergreen Terrace..." class="form-textarea"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="showModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="gradient-btn-primary px-6 py-2.5 rounded-xl font-bold text-sm">
                {{ isEditing ? 'Update Supplier' : 'Create Supplier' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay">
        <div class="modal-card max-w-md">
          <h3 class="text-xl font-bold text-white mb-2">Delete Supplier</h3>
          <p class="text-sm text-slate-300 mb-6">Are you sure you want to delete <strong class="text-white">{{ selectedSupplier?.name }}</strong>?</p>
          <div class="flex justify-end gap-3">
            <button (click)="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
            <button (click)="deleteSupplier()" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SuppliersComponent implements OnInit {
  PlusIcon = Plus;
  SearchIcon = Search;
  EditIcon = Edit3;
  TrashIcon = Trash2;
  UsersIcon = Users;
  MailIcon = Mail;
  PhoneIcon = Phone;
  MapPinIcon = MapPin;
  XIcon = X;

  suppliers: Supplier[] = [];
  showModal = false;
  isEditing = false;
  editingId: number | null = null;

  showDeleteModal = false;
  selectedSupplier: Supplier | null = null;

  formData: SupplierRequest = {
    name: '',
    email: '',
    phone: '',
    address: ''
  };

  constructor(private supplierService: SupplierService) {}

  ngOnInit() {
    this.loadSuppliers();
  }

  loadSuppliers() {
    this.supplierService.getAll().subscribe({
      next: (data) => (this.suppliers = data || [])
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.editingId = null;
    this.formData = { name: '', email: '', phone: '', address: '' };
    this.showModal = true;
  }

  openEditModal(sup: Supplier) {
    this.isEditing = true;
    this.editingId = sup.id!;
    this.formData = { name: sup.name, email: sup.email || '', phone: sup.phone || '', address: sup.address || '' };
    this.showModal = true;
  }

  saveSupplier() {
    if (!this.formData.name.trim()) return;

    if (this.isEditing && this.editingId) {
      this.supplierService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadSuppliers();
        }
      });
    } else {
      this.supplierService.create(this.formData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadSuppliers();
        }
      });
    }
  }

  confirmDelete(sup: Supplier) {
    this.selectedSupplier = sup;
    this.showDeleteModal = true;
  }

  deleteSupplier() {
    if (!this.selectedSupplier?.id) return;
    this.supplierService.delete(this.selectedSupplier.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.loadSuppliers();
      }
    });
  }
}
