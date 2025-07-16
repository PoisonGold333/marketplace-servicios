import { Routes } from '@angular/router';

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
  { path: 'my-availability', loadComponent: () => import('./features/provider-availability/provider-availability.component').then(m => m.ProviderAvailabilityComponent) },
  
  // Booking route
  { 
    path: 'book/:serviceId', 
    loadComponent: () => import('./features/booking/booking.component').then(m => m.BookingComponent) 
  },
  { path: 'contracts/:bookingId', loadComponent: () => import('./features/contracts/contract-view.component').then(m => m.ContractViewComponent) },
  
  // Catch all
  { path: '**', redirectTo: '/marketplace' }
];


