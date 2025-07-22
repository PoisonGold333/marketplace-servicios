import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
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
  errorMsg: string = '';
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router // <-- Inyecta el Router aquí
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) return;
    this.isLoading = true;
    this.errorMsg = '';
    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Redirige al dashboard después de login exitoso
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 0) {
          this.errorMsg = 'No se pudo conectar con el servidor';
        } else if (error.status === 400) {
          this.errorMsg = 'Datos inválidos';
        } else if (error.status === 401) {
          this.errorMsg = 'Credenciales incorrectas';
        } else if (error.status === 500) {
          this.errorMsg = 'Error interno del servidor';
        } else {
          this.errorMsg = error.error?.error || `Error ${error.status}`;
        }
      }
    });
  }

  loginWithGoogle() {
    window.location.href = 'http://localhost:5000/api/auth/google';
  }
}
