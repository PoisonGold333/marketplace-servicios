import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  isActive: boolean;
  createdAt: string;
  provider: {
    id: string;
    user: {
      id: string;
      name: string;
      email: string;
    };
  };
}

export interface ServiceResponse {
  message: string;
  data: Service[];
  total: number;
}

export interface CategoriesResponse {
  message: string;
  data: string[];
}

export interface ProviderProfile {
  id: string;
  userId: string;
  companyName?: string;
  nit?: string;
  address?: string;
  city?: string;
  phone?: string;
  website?: string;
  description?: string;
  rating: number;
  reviewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  services: any[];
  _count: {
    services: number;
    bookings: number;
  };
}

export interface UpdateProviderData {
  companyName?: string;
  nit?: string;
  address?: string;
  city?: string;
  phone?: string;
  website?: string;
  description?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ServiceService {
  private apiUrl = 'http://localhost:5000/api/services';

  constructor(private http: HttpClient) {}

  // Obtener todos los servicios con filtros opcionales
  getServices(filters?: {
    category?: string;
    search?: string;
    providerId?: string;
  }): Observable<ServiceResponse> {
    let params = new HttpParams();
    
    if (filters?.category) {
      params = params.set('category', filters.category);
    }
    
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    
    if (filters?.providerId) {
      params = params.set('providerId', filters.providerId);
    }

    return this.http.get<ServiceResponse>(this.apiUrl, { params });
  }

  // Obtener categorías disponibles
  getCategories(): Observable<CategoriesResponse> {
    return this.http.get<CategoriesResponse>(`${this.apiUrl}/categories`);
  }

  // Crear nuevo servicio
  createService(serviceData: {
    name: string;
    description: string;
    price: number;
    duration: number;
    category: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}`, serviceData);
  }

  // ✨ AGREGAR ESTE MÉTODO
  getServiceById(id: string): Observable<{message: string, data: Service}> {
    return this.http.get<{message: string, data: Service}>(`${this.apiUrl}/${id}`);
  }

  // Obtener mis servicios
  getMyServices() {
    return this.http.get<{data: any[]}>(`${this.apiUrl}/my-services`);
  }

  // Eliminar servicio
  deleteService(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ProviderService {
  private apiUrl = 'http://localhost:5000/api/providers';

  constructor(private http: HttpClient) {}

  // Obtener perfil del proveedor actual
  getMyProfile(): Observable<{message: string, data: ProviderProfile}> {
    return this.http.get<{message: string, data: ProviderProfile}>(`${this.apiUrl}/profile`);
  }

  // Actualizar perfil empresarial
  updateProfile(data: UpdateProviderData): Observable<{message: string, data: ProviderProfile}> {
    return this.http.put<{message: string, data: ProviderProfile}>(`${this.apiUrl}/profile`, data);
  }

  // Obtener perfil público de un proveedor
  getPublicProfile(providerId: string): Observable<{message: string, data: any}> {
    return this.http.get<{message: string, data: any}>(`${this.apiUrl}/public/${providerId}`);
  }
}