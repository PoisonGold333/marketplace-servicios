import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ProviderService, ProviderProfile, UpdateProviderData } from '../../core/services/service.service'; // ← CAMBIAR services por service.service
import { AuthService } from '../../core/services/auth.service'; // ← AGREGAR .service

@Component({
  selector: 'app-provider-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './provider-profile.component.html',
  styleUrls: ['./provider-profile.component.scss'],
  providers: [ProviderService]
})
export class ProviderProfileComponent implements OnInit {
  profile: ProviderProfile | null = null;
  isLoading = true;
  errorMessage = '';
  isEditing = false;
  isSaving = false;
  
  profileForm: FormGroup;

  constructor(
    private providerService: ProviderService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.profileForm = this.formBuilder.group({
      companyName: ['', [Validators.minLength(2)]],
      nit: ['', [Validators.pattern(/^[0-9]{9,12}-[0-9]$/)]],
      address: [''],
      city: [''],
      phone: ['', [Validators.pattern(/^\+?[0-9\s\-\(\)]{10,15}$/)]],
      website: ['', [Validators.pattern(/^https?:\/\/.+\..+/)]],
      description: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // Verificar que el usuario sea proveedor
    const user = this.authService.getCurrentUser();
    if (!user || user.role !== 'PROVIDER') {
      this.errorMessage = 'Solo los proveedores pueden acceder a esta página';
      this.isLoading = false;
      return;
    }

    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.providerService.getMyProfile().subscribe({
      next: (response: { data: any; }) => {
        console.log('✅ Perfil cargado:', response);
        this.profile = response.data;
        this.populateForm();
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('❌ Error cargando perfil:', error);
        this.errorMessage = 'No se pudo cargar tu perfil. Verifica tu conexión.';
        this.isLoading = false;
      }
    });
  }

  populateForm(): void {
    if (this.profile) {
      this.profileForm.patchValue({
        companyName: this.profile.companyName || '',
        nit: this.profile.nit || '',
        address: this.profile.address || '',
        city: this.profile.city || '',
        phone: this.profile.phone || '',
        website: this.profile.website || '',
        description: this.profile.description || ''
      });
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.populateForm(); // Restaurar valores originales
    }
  }

  onSubmit(): void {
    if (this.profileForm.valid) {
      this.isSaving = true;

      const updateData: UpdateProviderData = {};
      
      // Solo enviar campos que han cambiado
      Object.keys(this.profileForm.value).forEach(key => {
        const formValue = this.profileForm.value[key];
        const currentValue = this.profile?.[key as keyof ProviderProfile];
        
        if (formValue !== currentValue && formValue !== '') {
          updateData[key as keyof UpdateProviderData] = formValue;
        }
      });

      this.providerService.updateProfile(updateData).subscribe({
        next: (response: { data: any; }) => {
          console.log('✅ Perfil actualizado:', response);
          this.profile = response.data;
          this.isEditing = false;
          this.isSaving = false;
        },
        error: (error: { error: { error: string; }; }) => {
          console.error('❌ Error actualizando perfil:', error);
          this.errorMessage = error.error?.error || 'Error al actualizar perfil';
          this.isSaving = false;
        }
      });
    }
  }

  getCompletionPercentage(): number {
    if (!this.profile) return 0;
    
    const fields = [
      this.profile.companyName,
      this.profile.nit,
      this.profile.address,
      this.profile.city,
      this.profile.phone,
      this.profile.website,
      this.profile.description
    ];
    
    const completedFields = fields.filter(field => field && field.trim() !== '').length;
    return Math.round((completedFields / fields.length) * 100);
  }
}