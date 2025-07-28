import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule }                    from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatFormFieldModule }               from '@angular/material/form-field';
import { MatInputModule }                   from '@angular/material/input';
import { MatButtonModule }                  from '@angular/material/button';

/** Interfaz local para tipar en TS (no afecta a Vite) */
export interface ServiceItem {
  name:        string;
  description: string;
  price:       number;
  duration:    number;
  category:    string;
}

/** Data que recibe el diálogo */
export interface ServiceDialogData {
  service?:   ServiceItem;
  providerId?: string;
}

@Component({
  selector: 'app-edit-service-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-service-dialog.component.html',
  styleUrls: ['./edit-service-dialog.component.scss']
})
export class EditServiceDialogComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditServiceDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ServiceDialogData
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name:        [this.data.service?.name        || '', Validators.required],
      description: [this.data.service?.description || '', Validators.required],
      price:       [this.data.service?.price       || 0,  [Validators.required, Validators.min(0)]],
      duration:    [this.data.service?.duration    || 1,  [Validators.required, Validators.min(1)]],
      category:    [this.data.service?.category    || '', Validators.required]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value as ServiceItem);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
