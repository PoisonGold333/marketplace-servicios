import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Obtener usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      console.log('Usuario actual:', user);
    });
  }

  logout(): void {
    this.authService.logout();
  }

  getUserWelcome(): string {
    if (this.currentUser) {
      return `¡Bienvenido, ${this.currentUser.name}!`;
    }
    return '¡Bienvenido!';
  }

  getUserRole(): string {
    if (this.currentUser?.role === 'PROVIDER') {
      return 'Proveedor de Servicios';
    }
    return 'Cliente';
  }

  getUserEmail(): string {
    return this.currentUser?.email || '';
  }
}
