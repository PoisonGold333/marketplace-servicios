import { Component } from '@angular/core';
import { CommonModule }               from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule }              from '@angular/material/list';
import { MatButtonModule }            from '@angular/material/button';
import { MatIconModule }           from '@angular/material/icon'; 

@Component({
  selector: 'app-notifications-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './notifications-dialog.component.html',
  styleUrls: ['./notifications-dialog.component.scss']
})
export class NotificationsDialogComponent {
  notifications = [
    '¡Bienvenido!',
    'Tu reserva ha sido confirmada.',
    'Tienes un nuevo mensaje.'
  ];

  constructor(private dialogRef: MatDialogRef<NotificationsDialogComponent>) {}

  onClose() {
    this.dialogRef.close();
  }
}
