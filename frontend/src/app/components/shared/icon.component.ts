import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      stroke-width="2" 
      stroke-linecap="round" 
      stroke-linejoin="round"
      [class]="class"
    >
      <!-- box -->
      <ng-container *ngIf="name === 'box'">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
        <path d="m3.3 7 8.7 5 8.7-5"/>
        <path d="M12 22V12"/>
      </ng-container>

      <!-- dashboard -->
      <ng-container *ngIf="name === 'dashboard'">
        <rect width="7" height="9" x="3" y="3" rx="1"/>
        <rect width="7" height="5" x="14" y="3" rx="1"/>
        <rect width="7" height="9" x="14" y="12" rx="1"/>
        <rect width="7" height="5" x="3" y="16" rx="1"/>
      </ng-container>

      <!-- package -->
      <ng-container *ngIf="name === 'package'">
        <path d="m7.5 4.27 9 5.15"/>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
        <path d="m3.3 7 8.7 5 8.7-5"/>
        <path d="M12 22V12"/>
      </ng-container>

      <!-- layers -->
      <ng-container *ngIf="name === 'layers'">
        <polygon points="12 2 2 7 12 12 22 7 12 2"/>
        <polyline points="2 17 12 22 22 17"/>
        <polyline points="2 12 12 17 22 12"/>
      </ng-container>

      <!-- map-pin -->
      <ng-container *ngIf="name === 'map-pin'">
        <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"/>
        <circle cx="12" cy="10" r="3"/>
      </ng-container>

      <!-- users -->
      <ng-container *ngIf="name === 'users'">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
      </ng-container>

      <!-- inventory -->
      <ng-container *ngIf="name === 'inventory'">
        <path d="m3 16 4 4 4-4"/>
        <path d="M7 20V4"/>
        <path d="m21 8-4-4-4 4"/>
        <path d="M17 4v16"/>
      </ng-container>

      <!-- purchases -->
      <ng-container *ngIf="name === 'purchases'">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
        <path d="M3 6h18"/>
        <path d="M16 10a4 4 0 0 1-8 0"/>
      </ng-container>

      <!-- sales -->
      <ng-container *ngIf="name === 'sales'">
        <circle cx="8" cy="21" r="1"/>
        <circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
      </ng-container>

      <!-- logout -->
      <ng-container *ngIf="name === 'logout'">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
        <polyline points="16 17 21 12 16 7"/>
        <line x1="21" x2="9" y1="12" y2="12"/>
      </ng-container>

      <!-- shield -->
      <ng-container *ngIf="name === 'shield'">
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>
        <path d="m9 12 2 2 4-4"/>
      </ng-container>

      <!-- search -->
      <ng-container *ngIf="name === 'search'">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </ng-container>

      <!-- barcode -->
      <ng-container *ngIf="name === 'barcode'">
        <path d="M3 5v14"/>
        <path d="M8 5v14"/>
        <path d="M12 5v14"/>
        <path d="M17 5v14"/>
        <path d="M21 5v14"/>
      </ng-container>

      <!-- alert -->
      <ng-container *ngIf="name === 'alert'">
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
        <line x1="12" x2="12" y1="9" y2="13"/>
        <line x1="12" x2="12.01" y1="17" y2="17"/>
      </ng-container>

      <!-- plus -->
      <ng-container *ngIf="name === 'plus'">
        <path d="M5 12h14"/>
        <path d="M12 5v14"/>
      </ng-container>

      <!-- minus -->
      <ng-container *ngIf="name === 'minus'">
        <path d="M5 12h14"/>
      </ng-container>

      <!-- transfer -->
      <ng-container *ngIf="name === 'transfer'">
        <path d="M8 3 4 7l4 4"/>
        <path d="M4 7h16"/>
        <path d="m16 21 4-4-4-4"/>
        <path d="M20 17H4"/>
      </ng-container>

      <!-- x -->
      <ng-container *ngIf="name === 'x'">
        <path d="M18 6 6 18"/>
        <path d="m6 6 12 12"/>
      </ng-container>

      <!-- check -->
      <ng-container *ngIf="name === 'check'">
        <path d="M20 6 9 17l-5-5"/>
      </ng-container>

      <!-- edit -->
      <ng-container *ngIf="name === 'edit'">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </ng-container>

      <!-- trash -->
      <ng-container *ngIf="name === 'trash'">
        <path d="M3 6h18"/>
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      </ng-container>

      <!-- filter -->
      <ng-container *ngIf="name === 'filter'">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
      </ng-container>

      <!-- mail -->
      <ng-container *ngIf="name === 'mail'">
        <rect width="20" height="16" x="2" y="4" rx="2"/>
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
      </ng-container>

      <!-- phone -->
      <ng-container *ngIf="name === 'phone'">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
      </ng-container>

      <!-- building -->
      <ng-container *ngIf="name === 'building'">
        <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/>
        <path d="M9 22v-4h6v4"/>
        <path d="M8 6h.01"/>
        <path d="M16 6h.01"/>
        <path d="M12 6h.01"/>
        <path d="M12 10h.01"/>
        <path d="M12 14h.01"/>
        <path d="M16 10h.01"/>
        <path d="M16 14h.01"/>
        <path d="M8 10h.01"/>
        <path d="M8 14h.01"/>
      </ng-container>

      <!-- lock -->
      <ng-container *ngIf="name === 'lock'">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
      </ng-container>

      <!-- user -->
      <ng-container *ngIf="name === 'user'">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </ng-container>

      <!-- arrow-right -->
      <ng-container *ngIf="name === 'arrow-right'">
        <path d="M5 12h14"/>
        <path d="m12 5 7 7-7 7"/>
      </ng-container>
    </svg>
  `
})
export class IconComponent {
  @Input() name = '';
  @Input() class = 'w-5 h-5';
}
