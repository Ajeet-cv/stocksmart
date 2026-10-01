import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocationService } from '../../services/location.service';
import { Location, LocationRequest } from '../../models/location.model';
import { LucideAngularModule, Plus, Search, Edit3, Trash2, MapPin, X, Building } from 'lucide-angular';

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-white tracking-tight">Locations & Warehouses</h2>
          <p class="text-sm text-slate-400">Manage multi-location inventory hubs, stores, and fulfillment facilities</p>
        </div>
        <button (click)="openAddModal()" class="gradient-btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add New Location
        </button>
      </div>

      <!-- Locations Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let loc of locations" class="glass-panel p-6 glass-panel-hover flex flex-col justify-between border-white/10">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <lucide-icon [img]="MapPinIcon" class="w-5 h-5"></lucide-icon>
              </div>
              <div class="flex gap-2">
                <button (click)="openEditModal(loc)" class="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all">
                  <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                </button>
                <button (click)="confirmDelete(loc)" class="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all">
                  <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>

            <div class="flex items-center gap-2 mb-2">
              <h3 class="text-lg font-bold text-white">{{ loc.name }}</h3>
              <span [class.badge-amber]="loc.type === 'Warehouse'"
                    [class.badge-emerald]="loc.type === 'Retail Store'"
                    [class.badge-cyan]="loc.type === 'Distribution Center'"
                    class="badge">
                {{ loc.type || 'Warehouse' }}
              </span>
            </div>

            <p class="text-sm text-slate-300 leading-relaxed flex items-start gap-1.5 mt-3">
              <lucide-icon [img]="BuildingIcon" class="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5"></lucide-icon>
              <span>{{ loc.address || 'No address specified' }}</span>
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Location ID: #{{ loc.id }}</span>
            <span class="text-emerald-400 font-semibold">Operational</span>
          </div>
        </div>
      </div>

      <!-- Add / Edit Modal -->
      <div *ngIf="showModal" class="modal-overlay">
        <div class="modal-card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white">{{ isEditing ? 'Edit Location' : 'Add Location' }}</h3>
            <button (click)="showModal = false" class="text-slate-400 hover:text-white"><lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon></button>
          </div>

          <form (ngSubmit)="saveLocation()" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Location Name *</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required placeholder="Central Warehouse 1" class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Location Type *</label>
              <select [(ngModel)]="formData.type" name="type" required class="form-select">
                <option value="Warehouse">Warehouse</option>
                <option value="Retail Store">Retail Store</option>
                <option value="Distribution Center">Distribution Center</option>
                <option value="Fulfillment Hub">Fulfillment Hub</option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">Full Address</label>
              <textarea [(ngModel)]="formData.address" name="address" rows="3" placeholder="123 Industrial Parkway, Suite 400..." class="form-textarea"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="showModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="gradient-btn-primary px-6 py-2.5 rounded-xl font-bold text-sm">
                {{ isEditing ? 'Update Location' : 'Create Location' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay">
        <div class="modal-card max-w-md">
          <h3 class="text-xl font-bold text-white mb-2">Delete Location</h3>
          <p class="text-sm text-slate-300 mb-6">Are you sure you want to delete <strong class="text-white">{{ selectedLocation?.name }}</strong>?</p>
          <div class="flex justify-end gap-3">
            <button (click)="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
            <button (click)="deleteLocation()" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LocationsComponent implements OnInit {
  PlusIcon = Plus;
  SearchIcon = Search;
  EditIcon = Edit3;
  TrashIcon = Trash2;
  MapPinIcon = MapPin;
  XIcon = X;
  BuildingIcon = Building;

  locations: Location[] = [];
  showModal = false;
  isEditing = false;
  editingId: number | null = null;

  showDeleteModal = false;
  selectedLocation: Location | null = null;

  formData: LocationRequest = {
    name: '',
    address: '',
    type: 'Warehouse'
  };

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.loadLocations();
  }

  loadLocations() {
    this.locationService.getAll().subscribe({
      next: (data) => (this.locations = data || [])
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.editingId = null;
    this.formData = { name: '', address: '', type: 'Warehouse' };
    this.showModal = true;
  }

  openEditModal(loc: Location) {
    this.isEditing = true;
    this.editingId = loc.id!;
    this.formData = { name: loc.name, address: loc.address || '', type: loc.type || 'Warehouse' };
    this.showModal = true;
  }

  saveLocation() {
    if (!this.formData.name.trim()) return;

    if (this.isEditing && this.editingId) {
      this.locationService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadLocations();
        }
      });
    } else {
      this.locationService.create(this.formData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadLocations();
        }
      });
    }
  }

  confirmDelete(loc: Location) {
    this.selectedLocation = loc;
    this.showDeleteModal = true;
  }

  deleteLocation() {
    if (!this.selectedLocation?.id) return;
    this.locationService.delete(this.selectedLocation.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.loadLocations();
      }
    });
  }
}
