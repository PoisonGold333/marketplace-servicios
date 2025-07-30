import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

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
  template: `
    <h2 mat-dialog-title>🔔 Notificaciones</h2>
    <mat-dialog-content>
      <mat-list>
        <mat-list-item *ngFor="let note of notifications">
          <mat-icon matListIcon>notifications</mat-icon>
          <div matLine>{{ note }}</div>
        </mat-list-item>
      </mat-list>
      <p *ngIf="notifications.length === 0" class="no-notes">
        No tienes notificaciones nuevas.
      </p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .no-notes {
      font-style: italic;
      color: rgba(0,0,0,0.6);
      padding: 1rem 0;
    }
  `]
})
export class NotificationsDialogComponent {
  notifications: string[] = [
    'Tu servicio “Corte de Césped” fue reservado.',
    'Recibiste una calificación de 5 estrellas.',
    'Hay un nuevo mensaje de un cliente.'
  ];

  constructor(public dialogRef: MatDialogRef<NotificationsDialogComponent>) {}
}
