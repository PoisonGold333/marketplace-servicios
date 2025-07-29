import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ProfileService } from '../../core/services/profile.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  isEditing = false;
  isLoading = false;
  successMsg = '';
  errorMsg = '';
  avatarPreview: string | ArrayBuffer | null = null;
  avatarFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {
    
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{7,}$/)]],
      nombreEmpresa: ['', [Validators.required, Validators.minLength(2)]],
      nit: ['', [Validators.required, Validators.pattern(/^\d{6,}-\d{1}$/)]],
      direccion: ['', [Validators.required, Validators.minLength(5)]],
      city: ['', [Validators.required]],
      description: ['', [Validators.maxLength(300)]],
      avatar: [null]
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.isLoading = true;
    this.profileService.getMyProfile().subscribe({
      next: (resp: any) => {
        const data = resp.data || resp;
        // Actualiza el FormGroup con los datos recibidos
        this.profileForm.setValue({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          nombreEmpresa: data.nombreEmpresa || '',
          nit: data.nit || '',
          direccion: data.direccion || '',
          city: data.city || '', // <-- Agregado
          description: data.description || '', // <-- Agregado
          avatar: null
        });
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMsg = 'Error al cargar el perfil';
        this.isLoading = false;
      }
    });
  }

  onAvatarChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.avatarFile = file;
      const reader = new FileReader();
      reader.onload = () => this.avatarPreview = reader.result;
      reader.readAsDataURL(file);
    } else {
      this.errorMsg = 'Solo se permiten archivos de imagen.';
    }
  }

  removeAvatar(): void {
    this.avatarFile = null;
    this.avatarPreview = null;
    this.profileForm.patchValue({ avatar: null });
  }

  enableEdit(): void {
    this.isEditing = true;
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadProfile();
    this.successMsg = '';
    this.errorMsg = '';
    this.avatarFile = null;
    this.avatarPreview = null;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;
    this.isLoading = true;
    this.successMsg = '';
    this.errorMsg = '';

    const formData = new FormData();
    Object.entries(this.profileForm.value).forEach(([key, value]) => {
      if (key !== 'avatar') formData.append(key, value as string);
    });
    if (this.avatarFile) {
      formData.append('avatar', this.avatarFile);
    }

    this.profileService.updateProfile(formData).subscribe({
      next: () => {
        this.successMsg = 'Perfil actualizado correctamente';
        this.isEditing = false;
        this.isLoading = false;
        this.avatarFile = null;
      },
      error: () => {
        this.errorMsg = 'Error al actualizar el perfil';
        this.isLoading = false;
      }
    });
  }
}