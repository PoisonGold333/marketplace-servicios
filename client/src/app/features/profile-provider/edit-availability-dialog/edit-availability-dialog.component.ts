import { Component, Inject } from '@angular/core';
import { CommonModule }               from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatCheckboxModule }          from '@angular/material/checkbox';
import { MatFormFieldModule }         from '@angular/material/form-field';
import { MatInputModule }             from '@angular/material/input';
import { MatButtonModule }            from '@angular/material/button';

export interface AvailabilityItem {
  availableDays: string[];
  startTime:     string;
  endTime:       string;
}

@Component({
  selector: 'app-edit-availability-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-availability-dialog.component.html',
  styleUrls: ['./edit-availability-dialog.component.scss']
})
export class EditAvailabilityDialogComponent {
  availabilityForm: FormGroup;

  daysOfWeek = [
    'Lunes', 'Martes', 'Miércoles',
    'Jueves', 'Viernes', 'Sábado', 'Domingo'
  ];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditAvailabilityDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AvailabilityItem
  ) {
    this.availabilityForm = this.fb.group({
      availableDays: [data?.availableDays ?? []],
      startTime:     [data?.startTime     ?? ''],
      endTime:       [data?.endTime       ?? '']
    });
  }

  /** Añade o quita un día */
  toggleDay(day: string) {
    const sel: string[] = this.availabilityForm.value.availableDays;
    const updated = sel.includes(day)
      ? sel.filter(d => d !== day)
      : [...sel, day];
    this.availabilityForm.patchValue({ availableDays: updated });
  }

  /** Comprueba si está seleccionado */
  isSelected(day: string): boolean {
    return this.availabilityForm.value.availableDays.includes(day);
  }

  onSave() {
    if (this.availabilityForm.valid) {
      this.dialogRef.close(this.availabilityForm.value as AvailabilityItem);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
