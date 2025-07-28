import { Component, Inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatListModule }              from '@angular/material/list';
import { MatButtonModule }            from '@angular/material/button';
import { MatIconModule }           from '@angular/material/icon'; 



export interface ServiceHistoryItem {
  name: string;
  date: Date;
  price: number;
}

@Component({
  selector: 'app-service-history-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatListModule,
    MatButtonModule,
    MatIconModule

  ],
  templateUrl: './service-history-dialog.component.html',
  styleUrls: ['./service-history-dialog.component.scss']
})
export class ServiceHistoryDialogComponent {
  history: ServiceHistoryItem[];

  constructor(
    private dialogRef: MatDialogRef<ServiceHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { history?: ServiceHistoryItem[] }
  ) {
    this.history = data.history || [];
  }

  onClose() {
    this.dialogRef.close();
  }
}
