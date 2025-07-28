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
  ServiceHistoryDialogComponent,
  ServiceHistoryItem
} from './service-history-dialog/service-history-dialog.component';

import {
  NotificationsDialogComponent
} from './notifications-dialog/notifications-dialog.component';

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

  ],
  templateUrl: './profile-client.component.html',
  styleUrls: ['./profile-client.component.scss']
})
export class ProfileClientComponent {
  private dialog = inject(MatDialog);

  // datos falsos
  clientData: ClientProfileData & {
    avatarUrl: string;
    servicesCount: number;
  } = {
    name:          '.    María Rodríguez',
    email:         'maria.rodriguez@example.com',
    phone:         '3109876543',
    address:       'Cra. 45 # 67-89, Medellín',
    avatarUrl:     'https://i.pravatar.cc/150?img=47',
    servicesCount: 3
  };

  // historial falso
  serviceHistory: ServiceHistoryItem[] = [
    { name: 'Diseño Web',    date: new Date(2024, 2, 15), price: 250 },
    { name: 'SEO Básico',    date: new Date(2024, 4, 10), price: 120 },
    { name: 'Soporte TI',    date: new Date(2024, 6,  5), price: 80 }
  ];

  // abre dialog editar perfil
  openEditProfile() {
    this.dialog.open(EditProfileDialogComponent, {
      width: '400px',
      data: this.clientData
    }).afterClosed().subscribe((res: ClientProfileData|undefined) => {
      if (res) {
        Object.assign(this.clientData, res);
      }
    });
  }

  // abre dialog historial
  openHistory() {
    this.dialog.open(ServiceHistoryDialogComponent, {
      width: '600px',
      data: { history: this.serviceHistory }
    });
  }

  // abre dialog notificaciones
  openNotifications() {
    this.dialog.open(NotificationsDialogComponent, {
      width: '400px'
    });
  }
}
