import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ServiceService, Service } from '../../core/services/service.service';

@Component({
  selector: 'app-marketplace',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './marketplace.html',
  styleUrls: ['./marketplace.scss']
})
export class MarketplaceComponent implements OnInit {
  services: Service[] = [];
  categories: string[] = [];
  isLoading = true;
  errorMessage = '';
  searchTerm = '';
  selectedCategory = '';

  constructor(private serviceService: ServiceService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadServices();
  }

  loadServices(): void {
    this.isLoading = true;
    this.errorMessage = '';

    const filters: any = {};
    if (this.selectedCategory) filters.category = this.selectedCategory;
    if (this.searchTerm) filters.search = this.searchTerm;

    this.serviceService.getServices(filters).subscribe({
      next: (response) => {
        console.log('✅ Servicios cargados:', response);
        this.services = response.data;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando servicios:', error);
        this.errorMessage = 'No se pudieron cargar los servicios. Verifica tu conexión.';
        this.isLoading = false;
      }
    });
  }

  loadCategories(): void {
    this.serviceService.getCategories().subscribe({
      next: (response) => {
        this.categories = response.data;
      },
      error: (error) => {
        console.error('❌ Error cargando categorías:', error);
      }
    });
  }

  onSearch(): void {
    setTimeout(() => {
      this.loadServices();
    }, 500);
  }

  onCategoryChange(): void {
    this.loadServices();
  }

  contactProvider(service: Service): void {
    alert(`Contactar a ${service.provider.user.name}\nEmail: ${service.provider.user.email}`);
  }

  bookService(service: Service): void {
    alert(`Reservar servicio: ${service.name}\nPrecio: $${service.price} COP`);
  }
}