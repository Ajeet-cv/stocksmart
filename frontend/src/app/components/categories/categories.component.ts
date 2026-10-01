import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { Category, CategoryRequest } from '../../models/category.model';
import { LucideAngularModule, Plus, Search, Edit3, Trash2, Layers, X } from 'lucide-angular';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  template: `
    <div class="space-y-6 animate-fade-in">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-white tracking-tight">Product Categories</h2>
          <p class="text-sm text-slate-400">Group and classify inventory items for easy tracking</p>
        </div>
        <button (click)="openAddModal()" class="gradient-btn-primary px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2">
          <lucide-icon [img]="PlusIcon" class="w-4 h-4"></lucide-icon> Add New Category
        </button>
      </div>

      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div *ngFor="let cat of categories" class="glass-panel p-6 glass-panel-hover flex flex-col justify-between border-white/10">
          <div>
            <div class="flex items-center justify-between mb-4">
              <div class="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <lucide-icon [img]="LayersIcon" class="w-5 h-5"></lucide-icon>
              </div>
              <div class="flex gap-2">
                <button (click)="openEditModal(cat)" class="p-2 rounded-lg bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 transition-all">
                  <lucide-icon [img]="EditIcon" class="w-4 h-4"></lucide-icon>
                </button>
                <button (click)="confirmDelete(cat)" class="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition-all">
                  <lucide-icon [img]="TrashIcon" class="w-4 h-4"></lucide-icon>
                </button>
              </div>
            </div>
            <h3 class="text-lg font-bold text-white mb-1">{{ cat.name }}</h3>
            <p class="text-sm text-slate-300 leading-relaxed">{{ cat.description || 'No description provided' }}</p>
          </div>

          <div class="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
            <span>Category ID: #{{ cat.id }}</span>
            <span class="badge badge-indigo">Active Category</span>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div *ngIf="showModal" class="modal-overlay">
        <div class="modal-card">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-xl font-bold text-white">{{ isEditing ? 'Edit Category' : 'Add Category' }}</h3>
            <button (click)="showModal = false" class="text-slate-400 hover:text-white"><lucide-icon [img]="XIcon" class="w-5 h-5"></lucide-icon></button>
          </div>

          <form (ngSubmit)="saveCategory()" class="space-y-4">
            <div class="form-group">
              <label class="form-label">Category Name *</label>
              <input type="text" [(ngModel)]="formData.name" name="name" required placeholder="Electronics, Apparel, etc." class="form-input" />
            </div>

            <div class="form-group">
              <label class="form-label">Description</label>
              <textarea [(ngModel)]="formData.description" name="description" rows="3" placeholder="Category details..." class="form-textarea"></textarea>
            </div>

            <div class="flex justify-end gap-3 pt-4 border-t border-white/10">
              <button type="button" (click)="showModal = false" class="btn btn-secondary">Cancel</button>
              <button type="submit" class="gradient-btn-primary px-6 py-2.5 rounded-xl font-bold text-sm">
                {{ isEditing ? 'Update' : 'Create' }}
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Delete Confirmation Modal -->
      <div *ngIf="showDeleteModal" class="modal-overlay">
        <div class="modal-card max-w-md">
          <h3 class="text-xl font-bold text-white mb-2">Delete Category</h3>
          <p class="text-sm text-slate-300 mb-6">Are you sure you want to delete <strong class="text-white">{{ selectedCategory?.name }}</strong>?</p>
          <div class="flex justify-end gap-3">
            <button (click)="showDeleteModal = false" class="btn btn-secondary">Cancel</button>
            <button (click)="deleteCategory()" class="btn btn-danger">Delete</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CategoriesComponent implements OnInit {
  PlusIcon = Plus;
  SearchIcon = Search;
  EditIcon = Edit3;
  TrashIcon = Trash2;
  LayersIcon = Layers;
  XIcon = X;

  categories: Category[] = [];
  showModal = false;
  isEditing = false;
  editingId: number | null = null;

  showDeleteModal = false;
  selectedCategory: Category | null = null;

  formData: CategoryRequest = {
    name: '',
    description: ''
  };

  constructor(private categoryService: CategoryService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.categoryService.getAll().subscribe({
      next: (data) => (this.categories = data || [])
    });
  }

  openAddModal() {
    this.isEditing = false;
    this.editingId = null;
    this.formData = { name: '', description: '' };
    this.showModal = true;
  }

  openEditModal(cat: Category) {
    this.isEditing = true;
    this.editingId = cat.id!;
    this.formData = { name: cat.name, description: cat.description || '' };
    this.showModal = true;
  }

  saveCategory() {
    if (!this.formData.name.trim()) return;

    if (this.isEditing && this.editingId) {
      this.categoryService.update(this.editingId, this.formData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadCategories();
        }
      });
    } else {
      this.categoryService.create(this.formData).subscribe({
        next: () => {
          this.showModal = false;
          this.loadCategories();
        }
      });
    }
  }

  confirmDelete(cat: Category) {
    this.selectedCategory = cat;
    this.showDeleteModal = true;
  }

  deleteCategory() {
    if (!this.selectedCategory?.id) return;
    this.categoryService.delete(this.selectedCategory.id).subscribe({
      next: () => {
        this.showDeleteModal = false;
        this.loadCategories();
      }
    });
  }
}
