// src/app/features/profile-client/profile-client.component.ts

import { Component, inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { MatCardModule }              from '@angular/material/card';
import { MatButtonModule }            from '@angular/material/button';
import { MatIconModule }              from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatListModule }              from '@angular/material/list';
import { MatDividerModule }           from '@angular/material/divider';

import {
  EditProfileDialogComponent,
  ClientProfileData
} from './edit-profile-dialog/edit-profile-dialog.component';

import {
  NotificationsDialogComponent
} from './notifications-dialog/notifications-dialog.component';

import { RateServiceDialogComponent } from './rate-service-dialog/rate-service-dialog.component';

interface ActiveService {
  id: string;
  name: string;
  category: string;
  duration: number;        // en horas
  company: string;
  status: 'iniciado' | 'en-progreso' | 'terminado';
}

interface HistoryService {
  name: string;
  date: Date;
  price: number;
}

@Component({
  selector: 'app-profile-client',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatListModule,
    MatDividerModule,
    EditProfileDialogComponent,
    NotificationsDialogComponent,
    RateServiceDialogComponent
  ],
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.scss']
})
export class ProfileClientComponent {
  private dialog = inject(MatDialog);

  /** Avatar por defecto */
  defaultAvatar = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  /** Datos falsos de perfil */
  clientData: ClientProfileData & { avatarUrl: string } = {
    name:      'María Rodríguez',
    email:     'maria.rodriguez@example.com',
    phone:     '3109876543',
    address:   'Cra. 45 # 67-89, Medellín',
    avatarUrl: ''   // forzar uso de defaultAvatar
  };

  /** Servicios activos según lo pedido */
  activeServices: ActiveService[] = [
    {
      id:       '1',
      name:     'Instalación de riego automático',
      category: 'Jardinería',
      duration: 2,
      company:  'Lozano Jardines',
      status:   'iniciado'
    },
    {
      id:       '2',
      name:     'Paisajismo',
      category: 'Jardinería',
      duration: 5,
      company:  'Lozano Jardines',
      status:   'en-progreso'
    },
    {
      id:       '3',
      name:     'Poda de árboles',
      category: 'Jardinería',
      duration: 3,
      company:  'Lozano Jardines',
      status:   'terminado'
    }
  ];

  /** Historial de servicios al final */
  serviceHistory: HistoryService[] = [
    { name: 'Diseño Web', date: new Date(2024, 2, 15), price: 250 },
    { name: 'SEO Básico', date: new Date(2024, 4, 10), price: 120 },
    { name: 'Soporte TI', date: new Date(2024, 6,  5), price: 80  }
  ];

  /** Abre diálogo para editar perfil */
  openEditProfile(): void {
    this.dialog.open(EditProfileDialogComponent, {
      width: '400px',
      data: this.clientData
    });
  }

  /** Abre diálogo de notificaciones */
  openNotifications(): void {
    this.dialog.open(NotificationsDialogComponent, {
      width: '400px'
    });
  }

  /** Abre diálogo de calificación solo si el servicio está terminado */
  openRateDialog(svc: ActiveService): void {
    if (svc.status !== 'terminado') return;
    this.dialog.open(RateServiceDialogComponent, {
      width: '400px',
      data: { id: svc.id, name: svc.name }
    });
  }
}
