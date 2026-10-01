import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { LoginComponent } from './components/login/login.component';
import { LayoutComponent } from './components/layout/layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { LocationsComponent } from './components/locations/locations.component';
import { SuppliersComponent } from './components/suppliers/suppliers.component';
import { InventoryComponent } from './components/inventory/inventory.component';
import { PurchasesComponent } from './components/purchases/purchases.component';
import { SalesComponent } from './components/sales/sales.component';
import { ReportsComponent } from './components/reports/reports.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'locations', component: LocationsComponent },
      { path: 'suppliers', component: SuppliersComponent },
      { path: 'inventory', component: InventoryComponent },
      { path: 'purchases', component: PurchasesComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'barcode', redirectTo: 'locations', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'dashboard' }
];
