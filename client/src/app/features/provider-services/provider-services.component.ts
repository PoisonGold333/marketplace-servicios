import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ServiceService, Service } from '../../core/services/service.service';
import { AuthService } from '../../core/services/auth.service';
import { ProviderService, ProviderProfile } from '../../core/services/service.service';

@Component({
  selector: 'app-provider-services',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './provider-services.component.html',
  styleUrls: ['./provider-services.component.scss']
})
export class ProviderServicesComponent implements OnInit {
  services: Service[] = [];
  categories: string[] = [];
  isLoading = true;
  errorMessage = '';
  showCreateForm = false;
  createServiceForm: FormGroup;
  isCreating = false;
  providerProfile!: ProviderProfile;

  constructor(
    private serviceService: ServiceService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private providerService: ProviderService
  ) {
    this.createServiceForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      price: ['', [Validators.required, Validators.min(1000)]],
      duration: ['', [Validators.required, Validators.min(15)]],
      category: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Verificar que el usuario sea proveedor
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'PROVIDER') {
      this.errorMessage = 'Solo los proveedores pueden acceder a esta página';
      return;
    }

    this.loadCategories();
    this.loadMyServices();
    this.loadProviderProfile();
  }

  // Carga los servicios del proveedor
  loadMyServices(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.serviceService.getServices().subscribe({
      next: (response) => {
        // Si tu backend responde { data: [...] }
        this.services = response.data || [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error cargando servicios:', error);
        this.errorMessage = 'No se pudieron cargar tus servicios.';
        this.isLoading = false;
      }
    });
  }

  // Carga las categorías disponibles
  loadCategories(): void {
    this.serviceService.getCategories().subscribe({
      next: (response) => {
        // Si tu backend responde { categories: [...] }
        this.categories = response.categories || [];
      },
      error: (error) => {
        console.error('❌ Error cargando categorías:', error);
        this.categories = [];
      }
    });
  }

  // Carga el perfil del proveedor
  loadProviderProfile(): void {
    this.providerService.getMyProfile().subscribe({
      next: (response) => {
        this.providerProfile = response.data;
        console.log('✅ Perfil del proveedor cargado:', this.providerProfile);
      },
      error: (error) => {
        console.error('❌ Error cargando perfil del proveedor:', error);
      }
    });
  }

  toggleCreateForm(): void {
    this.showCreateForm = !this.showCreateForm;
    if (!this.showCreateForm) {
      this.createServiceForm.reset();
    }
  }

  onSubmitCreateService(): void {
    if (this.createServiceForm.valid) {
      this.isCreating = true;

      const serviceData = {
        name: this.createServiceForm.value.name,
        description: this.createServiceForm.value.description,
        price: parseFloat(this.createServiceForm.value.price),
        duration: parseInt(this.createServiceForm.value.duration),
        category: this.createServiceForm.value.category
      };

      this.serviceService.createService(serviceData).subscribe({
        next: (response) => {
          console.log('✅ Servicio creado:', response);
          this.showCreateForm = false;
          this.createServiceForm.reset();
          this.isCreating = false;
          this.loadMyServices();
        },
        error: (error) => {
          console.error('❌ Error creando servicio:', error);
          this.errorMessage = 'Error al crear el servicio. Intenta de nuevo.';
          this.isCreating = false;
        }
      });
    }
  }

  editService(service: Service): void {
    alert(`Editar servicio: ${service.name}\n(Funcionalidad en desarrollo)`);
  }

  deleteService(service: Service): void {
    if (confirm(`¿Estás seguro de eliminar el servicio "${service.name}"?`)) {
      alert(`Eliminar servicio: ${service.name}\n(Funcionalidad en desarrollo)`);
    }
  }

  toggleServiceStatus(service: Service): void {
    const newStatus = !service.isActive;
    alert(`${newStatus ? 'Activar' : 'Desactivar'} servicio: ${service.name}\n(Funcionalidad en desarrollo)`);
  }
}