import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BookingService, CreateBookingData, AvailabilityResponse } from '../../core/services/booking.service';
import { AuthService } from '../../core/services/auth.service';
import { ServiceService } from '../../core/services/service.service';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  provider: {
    id: string; // <-- AGREGA ESTA LÍNEA
    user: {
      name: string;
    };
  };
}

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  service: Service | null = null;
  serviceId: string = '';
  
  bookingForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  
  // Calendario y disponibilidad
  selectedDate: string = '';
  availableSlots: string[] = [];
  selectedTimeSlot: string = '';
  isCheckingAvailability = false;

  // Fechas mínimas y máximas
  minDate: string = '';
  maxDate: string = '';

  horariosDisponibles: any[] = []; // ← Inicializa como array vacío

  constructor(
    private bookingService: BookingService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    public router: Router,  // ← CAMBIAR DE private A public
    private route: ActivatedRoute,
    private serviceService: ServiceService
  ) {
    // Configurar fechas límite
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
    
    const maxDateObj = new Date();
    maxDateObj.setMonth(maxDateObj.getMonth() + 3);
    this.maxDate = maxDateObj.toISOString().split('T')[0];

    // Configurar formulario
    this.bookingForm = this.formBuilder.group({
      serviceId: [''], // Asigna el id del servicio seleccionado
      scheduledDate: ['', [Validators.required]],
      scheduledTime: ['', [Validators.required]],
      clientName: ['', [Validators.required, Validators.minLength(2)]],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientPhone: ['', [Validators.pattern(/^\+?[0-9\s\-\(\)]{10,15}$/)]],
      notes: ['', [Validators.maxLength(500)]]
    });
  }

  ngOnInit(): void {
    // Verificar autenticación
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    // Pre-llenar datos del usuario
    this.bookingForm.patchValue({
      clientName: user.name,
      clientEmail: user.email,
      clientPhone: user.phone || ''
    });

    // Obtener servicio desde la ruta
    this.route.params.subscribe(params => {
      this.serviceId = params['serviceId'];
      this.loadService();
    });

    // También intentar obtener desde el state
    const navigationState = this.router.getCurrentNavigation()?.extras.state;
    if (navigationState && navigationState['service']) {
      this.service = navigationState['service'];
    }
  }

  // Cargar servicio desde API
  private loadService(): void {
    if (this.service) return;

    this.isLoading = true;
    this.serviceService.getServiceById(this.serviceId).subscribe({
      next: (response: any) => {  // ← AGREGAR TIPO EXPLÍCITO
        this.service = response.data;
        this.isLoading = false;
      },
      error: (error: any) => {    // ← AGREGAR TIPO EXPLÍCITO
        console.error('❌ Error cargando servicio:', error);
        this.errorMessage = 'No se pudo cargar el servicio';
        this.isLoading = false;
      }
    });
  }

  // Cuando cambia la fecha seleccionada
  onDateChange(): void {
    const selectedDate = this.bookingForm.get('scheduledDate')?.value;
    
    if (selectedDate && this.service) {
      this.selectedDate = selectedDate;
      this.checkAvailability(selectedDate);
    } else {
      this.availableSlots = [];
      this.selectedTimeSlot = '';
    }
  }

  // Verificar disponibilidad para una fecha
  checkAvailability(date: string): void {
    if (!this.service) return;

    this.isCheckingAvailability = true;
    this.horariosDisponibles = [];
    this.selectedTimeSlot = '';
    this.errorMessage = '';

    this.bookingService.checkAvailability(this.service.id, date).subscribe({
      next: (response: any) => {
        console.log('✅ Disponibilidad obtenida:', response.data);
        this.horariosDisponibles = response.data ?? [];
        this.isCheckingAvailability = false;
      },
      error: (error: any) => {
        console.error('❌ Error verificando disponibilidad:', error);
        this.errorMessage = 'Error al verificar disponibilidad. Intenta con otra fecha.';
        this.isCheckingAvailability = false;
        this.horariosDisponibles = [];
      }
    });
  }

  // Seleccionar hora
  selectTimeSlot(slot: string) {
    this.selectedTimeSlot = slot;
    this.bookingForm.patchValue({ scheduledTime: slot });
  }

  // Enviar formulario
  onSubmit(): void {
    if (!this.service) {
      this.errorMessage = 'No se ha seleccionado un servicio';
      return;
    }

    if (this.bookingForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const user = this.authService.getCurrentUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const bookingData: CreateBookingData = {
      serviceId: this.service.id,
      providerId: this.service.provider.id, // <-- AGREGA ESTA LÍNEA
      scheduledDate: this.bookingForm.get('scheduledDate')?.value,
      scheduledTime: this.bookingForm.get('scheduledTime')?.value,
      clientName: this.bookingForm.get('clientName')?.value,
      clientEmail: this.bookingForm.get('clientEmail')?.value,
      clientPhone: this.bookingForm.get('clientPhone')?.value || undefined,
      notes: this.bookingForm.get('notes')?.value || undefined
    };

    console.log('📅 Creando reserva:', bookingData);

    this.bookingService.createBooking(bookingData).subscribe({
      next: (response: any) => {
        console.log('✅ Reserva creada:', response.data);
        this.successMessage = '¡Reserva creada exitosamente! El proveedor será notificado.';
        this.isLoading = false;
        setTimeout(() => {
          this.router.navigate(['/my-bookings']);
        }, 2000);
      },
      error: (error: any) => {
        console.error('❌ Error creando reserva:', error);
        this.errorMessage = error.error?.error || 'Error al crear la reserva. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  // Marcar todos los campos como tocados para mostrar errores
  private markFormGroupTouched(): void {
    Object.keys(this.bookingForm.controls).forEach(key => {
      const control = this.bookingForm.get(key);
      control?.markAsTouched();
    });
  }

  // Formatear fecha para mostrar
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-CO', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  // Formatear hora para mostrar
  formatTime(timeString: string): string {
    return timeString;
  }

  goToMarketplace(): void {
    this.router.navigate(['/marketplace']);
  }

  getFechaFormateada(fecha: string): string {
    if (!fecha) return '';
    const [year, month, day] = fecha.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day); // Fecha local
    const dias = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    return `${dias[dateObj.getDay()]}, ${day} de ${this.getMesEnEspañol(month)} de ${year}`;
  }

  getMesEnEspañol(mes: number): string {
    const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
    return meses[mes - 1];
  }

  }