import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { Router } from '@angular/router';
import { CustMangService, Customer, Order } from '../../services/cust-mang.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, MatGridListModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  private service = inject(CustMangService);
  private router = inject(Router);
  constructor(private cdr: ChangeDetectorRef) { }

  customers: Customer[] = [];

  ngOnInit() {
    this.service.getCustomers().subscribe((d: Customer[]) => {
      this.customers = d;
      this.cdr.detectChanges();
    });
    this.service.startConnection();
    this.service.orders$.subscribe((order: Order) => {
      if (order) {
        const customer = this.customers.find(c => c.customerId == order.customerId);
        if (customer) {
          customer.orders?.push(order || []);
          this.getLatest(customer.orders);
          this.cdr.detectChanges();
        }
      }
    });
  }

  getLatest(orders?: Order[]) {
    if (!orders?.length)
      return null;
    const latest = orders.reduce((a, b) => new Date(a.createdAt) > new Date(b.createdAt) ? a : b);
    return new Date(latest.createdAt).toLocaleString();
  }

  viewOrders(id: number) {
    this.router.navigate(['/order-list'], { queryParams: { customerId: id } });
  }
}
