// src/app/features/marketplace/marketplace.component.ts

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule }               from '@angular/forms';
import { Router }                    from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';

import { ServiceService } from '../../core/services/service.service';
import { AuthService }    from '../../core/services/auth.service';
import { DiscountDialogComponent } from './discount-dialog.component';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DecimalPipe,
    MatDialogModule,
    DiscountDialogComponent
  ],
  templateUrl: './marketplace.html',
  styleUrls: ['./marketplace.scss']
})
export class MarketplaceComponent implements OnInit {
  private dialog = inject(MatDialog);

  categories: string[] = [];
  services: any[] = [];
  isLoading = true;
  errorMessage = '';

  // Filtros
  searchTerm = '';
  selectedCategory = '';

  constructor(
    private serviceService: ServiceService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadServices();
    this.loadCategories();
  }

  loadServices(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.serviceService.getServices().subscribe({
      next: (response) => {
        this.services = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = 'Error al cargar los servicios';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.serviceService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories || [];
      },
      error: () => {
        this.categories = [];
      }
    });
  }

  onSearch(): void {
    // TODO: Implementar filtro por búsqueda
  }

  onCategoryChange(): void {
    // TODO: Implementar filtro por categoría
  }

  bookService(service: any): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/book/${service.id}` }
      });
      return;
    }
    if (user.role === 'PROVIDER' && user.provider?.id === service.providerId) {
      alert('No puedes reservar tu propio servicio');
      return;
    }
    this.router.navigate(['/book', service.id], {
      state: { service }
    });
  }

  isProviderView(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'PROVIDER';
  }

  contactProvider(service: any): void {
    // TODO: Implementar contacto con proveedor
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  /** Abre el diálogo de descuento 10% */
  openDiscountDialog(): void {
    this.dialog.open(DiscountDialogComponent, {
      width: '800px'
    });
  }
}
