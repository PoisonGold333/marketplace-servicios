import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule }     from '@angular/material/input';
import { MatButtonModule }    from '@angular/material/button';

export interface ProviderProfileData {
  companyName: string;
  specialty:   string;      // ← nuevo
  avatarUrl:   string;      // ← nuevo
  nit:         string;
  address:     string;
  city:        string;
  phone:       string;
  website?:    string;
  description: string;
}

@Component({
  selector: 'app-edit-profile-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './edit-profile-dialog.component.html',
  styleUrls: ['./edit-profile-dialog.component.scss']
})
export class EditProfileDialogComponent implements OnInit {
  form!: FormGroup;
  private fb = new FormBuilder();

  constructor(
    private dialogRef: MatDialogRef<EditProfileDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProviderProfileData
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      companyName: [this.data.companyName, Validators.required],
      nit:         [this.data.nit,         Validators.required],
      address:     [this.data.address,     Validators.required],
      city:        [this.data.city,        Validators.required],
      phone:       [this.data.phone,       Validators.required],
      website:     [this.data.website || ''],
      description: [this.data.description, Validators.required]
    });
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value as ProviderProfileData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
