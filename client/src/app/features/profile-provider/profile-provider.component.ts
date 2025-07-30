// src/app/features/profile-provider/profile-provider.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { MatCardModule }              from '@angular/material/card';
import { MatButtonModule }            from '@angular/material/button';
import { MatIconModule }              from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatProgressSpinnerModule }   from '@angular/material/progress-spinner';
import { MatFormFieldModule }         from '@angular/material/form-field';
import { MatInputModule }             from '@angular/material/input';
import { MatListModule }              from '@angular/material/list';

import {
  EditProfileDialogComponent,
  ProviderProfileData
} from './edit-profile-dialog/edit-profile-dialog.component';

import {
  EditServiceDialogComponent,
  ServiceItem
} from './edit-service-dialog/edit-service-dialog.component';

import {
  EditAvailabilityDialogComponent,
  AvailabilityItem
} from './edit-availability-dialog/edit-availability-dialog.component';

import { NotificationsDialogComponent } from './notifications-dialog/notifications-dialog.component';

@Component({
  selector: 'app-profile-provider',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
  ],
  templateUrl: './profile-provider.component.html',
  styleUrls: ['./profile-provider.component.scss']
})
export class ProfileProviderComponent {
  private dialog = inject(MatDialog);

  /**
   * Extendemos el tipo ProviderProfileData para incluir 'rating'
   */
  providerData: ProviderProfileData & { rating: number } = {
    companyName: 'Servicios de Jardinería ',
    specialty:   'Jardinería',
    avatarUrl:   'https://i.pravatar.cc/150?img=12',
    nit:         '123456789',
    address:     'Calle Falsa 123',
    city:        'Bogotá',
    phone:       '3001234567',
    website:     '',
    description: '10 años de experiencia.',
    rating:      4   // ★★★★☆
  };

  /**
   * Lista de servicios propios
   */
  services: ServiceItem[] = [
    {
      name:        'Corte de Césped',
      description: 'Mantenimiento de césped',
      price:       30,
      duration:    1,
      category:    'Jardinería'
    }
  ];

  /**
   * Ejemplo de servicios activos (ficticios)
   */
  activeServices: Array<{
    name: string;
    category: string;
    duration: number;
    company: string;
    status: 'iniciado' | 'en-progreso' | 'terminado';
  }> = [
    {
      name:     'Instalación de riego automático',
      category: 'Jardinería',
      duration: 2,
      company:  'Lozano Jardines',
      status:   'iniciado'
    },
    {
      name:     'Paisajismo',
      category: 'Jardinería',
      duration: 5,
      company:  'Lozano Jardines',
      status:   'en-progreso'
    },
    {
      name:     'Poda de árboles',
      category: 'Jardinería',
      duration: 3,
      company:  'Lozano Jardines',
      status:   'terminado'
    }
  ];

  /** Abre diálogo para editar perfil */
  openEditProfileDialog() {
    this.dialog.open(EditProfileDialogComponent, {
      data: this.providerData,
      width: '400px'
    }).afterClosed().subscribe(res => {
      if (res) {
        this.providerData = { ...this.providerData, ...res };
      }
    });
  }

  /** Abre diálogo para editar disponibilidad */
  openEditAvailabilityDialog() {
    this.dialog.open(EditAvailabilityDialogComponent, {
      data: { availableDays: [], startTime: '', endTime: '' } as AvailabilityItem,
      width: '500px'
    }).afterClosed().subscribe(res => {
      if (res) {
        console.log('Disponibilidad actualizada:', res);
      }
    });
  }

  /** Abre diálogo para notificaciones */
  openNotificationsDialog() {
    this.dialog.open(NotificationsDialogComponent, { width: '400px' });
  }

  /** Abre diálogo para crear nuevo servicio */
  openAddServiceDialog() {
    this.dialog.open(EditServiceDialogComponent, {
      data: { providerId: '' },
      width: '600px'
    }).afterClosed().subscribe((svc: ServiceItem | undefined) => {
      if (svc) this.services.push(svc);
    });
  }

  /** Edita primer servicio de la lista (demo) */
  openGlobalEditService() {
    if (!this.services.length) return;
    const toEdit = this.services[0];
    this.dialog.open(EditServiceDialogComponent, {
      data: { service: toEdit },
      width: '600px'
    }).afterClosed().subscribe((svc: ServiceItem | undefined) => {
      if (svc) Object.assign(toEdit, svc);
    });
  }

  /** Elimina todos los servicios (demo) */
  openGlobalDeleteService() {
    this.services = [];
  }
}
