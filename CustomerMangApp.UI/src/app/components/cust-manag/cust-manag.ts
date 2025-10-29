import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { CustMangService, Customer } from '../../services/cust-mang.service';
import { CustomerDialog } from '../customer-dialog/customer-dialog';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-cust-manag',
  imports: [MatToolbarModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatIconModule,
    MatDialogModule],
  templateUrl: './cust-manag.html',
  styleUrls: ['./cust-manag.css'],
})

export class CustManag implements OnInit {
  displayedColumns: string[] = ['customerId', 'customerName', 'email','isActive', 'actions'];
  customers = new MatTableDataSource<Customer>([]);

  constructor(private custMangService: CustMangService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.custMangService.getCustomers().subscribe((data: any) => {
      this.customers.data = data;
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CustomerDialog, {
      width: '400px',
      data: { customer: null },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.custMangService.addCustomer(result).subscribe(() => {
          this.loadCustomers();
        });
      }
    });
  }

  openEditDialog(customer: Customer): void {
    const dialogRef = this.dialog.open(CustomerDialog, {
      width: '400px',
      data: { customer },
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.custMangService.updateCustomer(customer.customerId, result).subscribe(() => {
          this.loadCustomers();
        });
      }
    });
  }

  deleteCustomer(id: number): void {
    if (confirm('Are you sure you want to delete this customer?')) {
      this.custMangService.deleteCustomer(id).subscribe(() => {
        this.loadCustomers();
      });
    }
  }
}
