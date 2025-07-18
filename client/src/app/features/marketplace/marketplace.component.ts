import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ServiceService, Service } from '../../core/services/service.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './marketplace.html',
  styleUrls: ['./marketplace.scss']
})
export class MarketplaceComponent implements OnInit {
[x: string]: any;
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
        console.log('✅ Servicios cargados:', response.data);
        this.services = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando servicios:', error);
        this.errorMessage = 'Error al cargar los servicios';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.serviceService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.categories || [];
        console.log('✅ Categorías cargadas:', this.categories);
      },
      error: (error) => {
        console.error('❌ Error cargando categorías:', error);
        this.categories = [];
      }
    });
  }

  onSearch(): void {
    // Implementar búsqueda
    console.log('🔍 Buscando:', this.searchTerm);
    // TODO: Implementar filtro por búsqueda
  }

  onCategoryChange(): void {
    // Implementar filtro por categoría
    console.log('📂 Categoría seleccionada:', this.selectedCategory);
    // TODO: Implementar filtro por categoría
  }

  // Reservar servicio
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
      state: { service: service }
    });
  }

  // Verificar si es vista de proveedor
  isProviderView(): boolean {
    const user = this.authService.getCurrentUser();
    return user?.role === 'PROVIDER';
  }

  // Contactar proveedor
  contactProvider(service: any): void {
    // TODO: Implementar contacto con proveedor
    console.log('📞 Contactando proveedor:', service);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }
}