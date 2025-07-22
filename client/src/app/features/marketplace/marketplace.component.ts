import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { ServiceService, Service } from '../../core/services/service.service';
import { AuthService } from '../../core/services/auth.service';

interface ServiceListResponse {
  message: string;
  data: any[];
  total: number;
}

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './marketplace.html',
  styleUrls: ['./marketplace.scss']
})
export class MarketplaceComponent implements OnInit {
  categories: string[] = [];
  services: any[] = [];
  isLoading = true;
  errorMessage = '';
  total = 0;

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

    this.serviceService.getAllServices().subscribe({
      next: (resp: ServiceListResponse) => {
        console.log('Respuesta del backend:', resp);
        this.services = resp.data;
        this.total = resp.total;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error cargando servicios:', err);
        this.services = [];
        this.total = 0;
        this.isLoading = false;
        this.errorMessage = 'Error cargando servicios';
      }
    });
  }

  loadCategories(): void {
    this.serviceService.getCategories().subscribe({
      next: (response: any) => {
        this.categories = response.data || [];
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
  }

  onCategoryChange(): void {
    // Implementar filtro por categoría
    console.log('📂 Categoría seleccionada:', this.selectedCategory);
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

  // Ahora filteredCategories depende de los servicios filtrados
  get filteredCategories(): string[] {
    const categoriesSet = new Set<string>();
    this.filteredServices.forEach(service => {
      if (service.categoria) {
        categoriesSet.add(service.categoria);
      }
    });
    return Array.from(categoriesSet).sort();
  }

  // Servicios filtrados por búsqueda y categoría
  get filteredServices(): any[] {
    return this.services.filter(service => {
      const matchesCategory = this.selectedCategory ? service.categoria === this.selectedCategory : true;
      const matchesSearchTerm = this.searchTerm
        ? service.nombre.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      return matchesCategory && matchesSearchTerm;
    });
  }
}