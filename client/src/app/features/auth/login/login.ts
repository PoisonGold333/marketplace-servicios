import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = '';
      
      console.log('=== DEBUG LOGIN ===');
      console.log('Datos a enviar:', this.loginForm.value);
      
      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('✅ Login exitoso:', response);
          this.isLoading = false;
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('❌ Error completo en login:', error);
          console.error('❌ Status:', error.status);
          console.error('❌ Error body:', error.error);
          console.error('❌ URL:', error.url);
          
          this.isLoading = false;
          
          // Manejo mejorado de errores
          if (error.status === 0) {
            this.errorMessage = 'No se puede conectar al servidor. Verifica que esté corriendo.';
          } else if (error.status === 400) {
            this.errorMessage = error.error?.error || 'Datos inválidos';
          } else if (error.status === 401) {
            this.errorMessage = 'Email o contraseña incorrectos';
          } else if (error.status === 500) {
            this.errorMessage = 'Error interno del servidor';
          } else {
            this.errorMessage = error.error?.error || `Error ${error.status}`;
          }
        }
      });
    }
  }
}
