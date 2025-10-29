import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; 
//import { MatError } from '@angular/material/form-field'; 

@Component({
  selector: 'app-customer-dialog',
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
     MatSelectModule,
    MatOptionModule,
    ReactiveFormsModule
  ],
  templateUrl: './customer-dialog.html',
  styleUrl: './customer-dialog.css',
})
export class CustomerDialog {
  customerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CustomerDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { customer: any }
  ) {
    this.customerForm = this.fb.group({
      customerName: [data.customer?.customerName || '', [Validators.required, Validators.minLength(3)]],
      email: [data.customer?.email || '', [Validators.required, Validators.email]],
      isActive: [data.customer?.isActive || true, [Validators.required]],
    });

  }

  save(): void {
    if (this.customerForm.valid) {
      this.dialogRef.close(this.customerForm.value);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
