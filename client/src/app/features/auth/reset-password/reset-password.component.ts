import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  password = '';
  mensaje = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  onSubmit() {
    const token = this.route.snapshot.paramMap.get('token') || '';
    this.authService.resetPassword(token, this.password).subscribe({
      next: () => this.mensaje = 'Contraseña restablecida correctamente',
      error: (err: any) => this.mensaje = err.error?.error || 'Error'
    });
  }
}