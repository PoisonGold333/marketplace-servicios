import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    FormsModule,
    HttpClientModule
  ],
  template: `
    <div class="app-container">
      <!-- Navigation Header -->
      <nav class="navbar">
        <div class="nav-container">
          <!-- Logo -->
          <div class="nav-logo">
            <a routerLink="/marketplace">🛍️ MarketPlace</a>
          </div>

          <!-- Navigation Links -->
          <div class="nav-links">
            <a routerLink="/marketplace" routerLinkActive="active" [routerLinkActiveOptions]="{exact:false}">
              🏪 Marketplace
            </a>
            
            <div *ngIf="!isLoggedIn()" class="auth-links">
              <a routerLink="/login" routerLinkActive="active">🔑 Iniciar Sesión</a>
              <a routerLink="/register" routerLinkActive="active" class="btn-register">📝 Registrarse</a>
            </div>

            <div *ngIf="isLoggedIn()" class="user-menu">
              <a routerLink="/dashboard" routerLinkActive="active">📊 Dashboard</a>
              
              <!-- Solo mostrar para proveedores -->
              <a *ngIf="getCurrentUser()?.role === 'PROVIDER'" 
                 routerLink="/my-services" 
                 routerLinkActive="active">
                 🛠️ Mis Servicios
              </a>
              
              <a *ngIf="getCurrentUser()?.role === 'PROVIDER'" 
                 routerLink="/my-profile" 
                 routerLinkActive="active">
                 🏢 Mi Perfil
              </a>
              
              <span class="user-name">👋 {{ getCurrentUser()?.name }}</span>
              <button (click)="logout()" class="btn-logout">🚪 Salir</button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="footer">
        <div class="footer-content">
          <p>© 2024 MarketPlace de Servicios - Proyecto Integrador 3</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .app-container {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }

    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 15px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-logo a {
      font-size: 1.8rem;
      font-weight: bold;
      color: white;
      text-decoration: none;
      transition: transform 0.3s;
    }

    .nav-logo a:hover {
      transform: scale(1.05);
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .nav-links a {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 8px;
      transition: background-color 0.3s;
      font-weight: 500;
    }

    .nav-links a:hover {
      background-color: rgba(255,255,255,0.1);
    }

    .nav-links a.active {
      background-color: rgba(255,255,255,0.2);
      font-weight: bold;
    }

    .btn-register {
      background-color: #27ae60 !important;
      color: white !important;
    }

    .btn-register:hover {
      background-color: #229954 !important;
    }

    .auth-links {
      display: flex;
      gap: 10px;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .user-name {
      color: #ecf0f1;
      font-weight: 500;
    }

    .btn-logout {
      background: #e74c3c;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 500;
      transition: background-color 0.3s;
    }

    .btn-logout:hover {
      background: #c0392b;
    }

    .main-content {
      flex: 1;
      background: #f8f9fa;
    }

    .footer {
      background: #2c3e50;
      color: white;
      padding: 20px 0;
    }

    .footer-content {
      max-width: 1200px;
      margin: 0 auto;
      text-align: center;
      padding: 0 20px;
    }

    .footer-content p {
      margin: 0;
      color: #bdc3c7;
    }

    @media (max-width: 768px) {
      .nav-container {
        flex-direction: column;
        gap: 15px;
      }
      
      .nav-links {
        flex-wrap: wrap;
        justify-content: center;
      }
      
      .user-menu {
        flex-direction: column;
        gap: 10px;
      }
    }
  `]
})
export class AppComponent implements OnInit {
  title = 'marketplace-servicios';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Auto-login si hay token guardado
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token encontrado, usuario ya logueado');
    }
  }

  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/marketplace']);
  }
}

@NgModule({
  // ...
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AppModule { }
