import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, RegisterRequest } from '../../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['CLIENT', Validators.required],
      phone: [''],
      // Campos de proveedor
      companyName: [''],
      nit: [''],
      address: [''],
      city: [''],
      website: [''],
      description: ['']
    });
  }

  ngOnInit(): void {
    // Aquí puedes agregar lógica que necesites al inicializar el componente
  }

  onSubmit(): void {
    const formValue = this.registerForm.value;

    // Construye el objeto de registro
    const userData: RegisterRequest = {
      name: formValue.name,
      email: formValue.email,
      password: formValue.password,
      role: formValue.role,
      phone: formValue.phone
    };

    // Si es proveedor, agrega los campos extra
    if (formValue.role === 'PROVIDER') {
      Object.assign(userData, {
        companyName: formValue.companyName,
        nit: formValue.nit,
        address: formValue.address,
        city: formValue.city,
        website: formValue.website,
        description: formValue.description
      });
    }

    this.isLoading = true;
    this.authService.register(userData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Error en registro:', error);
        this.isLoading = false;
        this.errorMessage = error.error?.error || 'Error en el servidor';
      }
    });
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:5000/api/auth/google';
  }

  registerWithGoogle() {
    // Aquí va la lógica para registro con Google (puedes dejarlo vacío por ahora)
    console.log('Registro con Google');
  }
}
