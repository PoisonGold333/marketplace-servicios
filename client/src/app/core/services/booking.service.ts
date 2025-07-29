import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Booking {
  id: string;
  clientId: string;
  serviceId: string;
  providerId: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: number;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'NO_SHOW';
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  service?: {
    name: string;
    category: string;
    duration: number;
  };
  provider?: {
    user: {
      name: string;
      phone?: string;
    };
  };
  client?: {
    name: string;
    email: string;
    phone?: string;
  };
}

export interface CreateBookingData {
  serviceId: string;
  providerId: string;
  scheduledDate: string;
  scheduledTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
}

export interface AvailabilityResponse {
  date: string;
  availableSlots: string[];
  serviceDuration: number;
  servicePrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private apiUrl = 'http://localhost:5000/api/bookings';

  constructor(private http: HttpClient) {}

  // Crear nueva reserva
  createBooking(bookingData: CreateBookingData): Observable<{message: string, data: Booking}> {
    return this.http.post<{message: string, data: Booking}>(`${this.apiUrl}`, bookingData);
  }

  // Obtener mis reservas (como cliente)
  getMyBookings(): Observable<{message: string, data: Booking[]}> {
    return this.http.get<{message: string, data: Booking[]}>(`${this.apiUrl}/my-bookings`);
  }

  // Obtener reservas del proveedor
  getProviderBookings(): Observable<{message: string, data: Booking[]}> {
    return this.http.get<{message: string, data: Booking[]}>(`${this.apiUrl}/provider-bookings`);
  }

  // Actualizar estado de reserva (solo proveedor)
  updateBookingStatus(bookingId: string, status: string): Observable<{message: string, data: Booking}> {
    return this.http.put<{message: string, data: Booking}>(`${this.apiUrl}/${bookingId}/status`, { status });
  }

  // Verificar disponibilidad de un proveedor
  checkAvailability(providerId: string, date: string) {
    return this.http.get<{data: any[]}>(`${this.apiUrl}/${providerId}/disponibilidad?date=${date}`);
  }
}