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
} from '../edit-profile-dialog/edit-profile-dialog.component';

import {
  EditServiceDialogComponent,
  ServiceItem
} from '../edit-service-dialog/edit-service-dialog.component';

import {
  EditAvailabilityDialogComponent,
  AvailabilityItem
} from '../edit-availability-dialog/edit-availability-dialog.component';

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

  // Datos de ejemplo
  providerData: ProviderProfileData = {
    companyName: 'Servicios de Jardineria ',
    specialty:   'Jardinería',
    avatarUrl:   'https://i.pravatar.cc/150?img=12',
    nit:         '123456789',
    address:     'Calle Falsa 123',
    city:        'Bogotá',
    phone:       '3001234567',
    website:     '',
    description: '10 años de experiencia.'
  };

  services: ServiceItem[] = [
    {
      name:        'Corte de Césped',
      description: 'Mantenimiento de césped',
      price:       30,
      duration:    1,
      category:    'Jardinería'
    }
  ];

  // PERFIL
  openEditProfileDialog() {
    this.dialog.open(EditProfileDialogComponent, {
      data: this.providerData,
      width: '400px'
    }).afterClosed().subscribe((res) => {
      if (res) this.providerData = res;
    });
  }

  openEditAvailabilityDialog() {
    this.dialog.open(EditAvailabilityDialogComponent, {
      data: { availableDays: [], startTime: '', endTime: '' } as AvailabilityItem,
      width: '500px'
    }).afterClosed().subscribe(res => {
      if (res) console.log('Disponibilidad actualizada:', res);
    });
  }

  // SERVICIOS
  openAddServiceDialog() {
    this.dialog.open(EditServiceDialogComponent, {
      data: { providerId: '' },
      width: '600px'
    }).afterClosed().subscribe((svc: ServiceItem | undefined) => {
      if (svc) this.services.push(svc);
    });
  }

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

  openGlobalDeleteService() {
    this.services = [];
  }
}
