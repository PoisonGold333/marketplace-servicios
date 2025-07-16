import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvailabilityService } from '../../core/services/availability.service';

@Component({
  selector: 'app-provider-availability',
  standalone: true,
  templateUrl: './provider-availability.component.html',
  styleUrls: ['./provider-availability.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class ProviderAvailabilityComponent implements OnInit {
  slots: any[] = [];
  days = [
    'Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'
  ];
  providerId = ''; // Debes obtener el ID del proveedor autenticado

  constructor(private availabilityService: AvailabilityService) {}

  ngOnInit(): void {
    // Asigna providerId según tu lógica de autenticación
    this.availabilityService.getAvailability(this.providerId).subscribe(res => {
      this.slots = res.data;
    });
  }

  addSlot() {
    this.slots.push({ dayOfWeek: 1, startTime: '09:00', endTime: '17:00' });
  }

  save() {
    this.availabilityService.setAvailability(this.providerId, this.slots).subscribe(() => {
      alert('Disponibilidad guardada');
    });
  }

  deleteService(id: string): void {
  
  }
}