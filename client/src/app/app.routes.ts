import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login';

export const routes: Routes = [
  { path: '', redirectTo: '/marketplace', pathMatch: 'full' },
  
  // Main routes (solo las que existen)
  { 
    path: 'marketplace', 
    loadComponent: () => import('./features/marketplace/marketplace.component').then(m => m.MarketplaceComponent) 
  },
  { 
    path: 'my-profile', 
    loadComponent: () => import('./features/provider-profile/provider-profile.component').then(m => m.ProviderProfileComponent) 
  },
  { 
    path: 'my-services', 
    loadComponent: () => import('./features/provider-services/provider-services.component').then(m => m.ProviderServicesComponent) 
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.DashboardComponent) 
  },

  {
   path : 'profile-provider',
    loadComponent: () =>import('./features/profile-provider/profile-provider.component').then(
    (m) => m.ProfileProviderComponent
   )
        
},
   
  {
    path: 'profile-client',
    loadComponent: () =>
      import('./features/profile-client/profile-client.component').then(
        (m) => m.ProfileClientComponent
      )
  },
  { path: 'my-availability', loadComponent: () => import('./features/provider-availability/provider-availability.component').then(m => m.ProviderAvailabilityComponent) },
  
  // Booking route
  { 
    path: 'book/:serviceId', 
    loadComponent: () => import('./features/booking/booking.component').then(m => m.BookingComponent) 
  },
  { path: 'contracts/:bookingId', loadComponent: () => import('./features/contracts/contract-view.component').then(m => m.ContractViewComponent) },
  { path: 'login', loadComponent: () => import('./features/auth/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./features/auth/register/register').then(m => m.RegisterComponent) },
  {
    path: 'reset-password/:token',
    loadComponent: () =>
      import('./features/auth/reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./features/auth/forgotPassword/forgot-password.component').then(m => m.ForgotPasswordComponent)
  },

  
  
  // Catch all
  { path: '**', redirectTo: '/marketplace' }
];


