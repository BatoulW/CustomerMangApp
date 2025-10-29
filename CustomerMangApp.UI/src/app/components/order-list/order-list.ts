import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { CustMangService } from '../../services/cust-mang.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
export interface Order {
  orderId: number;
  orderDesc: string;
  amount: number;
  createdAt: string;
}

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule,
    FormsModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatListModule],
  templateUrl: './order-list.html',
  styleUrl: './order-list.css',
})
export class OrderList implements OnInit {
  private route = inject(ActivatedRoute);
  private service = inject(CustMangService);
  constructor(private cdr: ChangeDetectorRef) { }

  customerId!: number;
  orders: Order[] = [];
  autoUpdateEnabled = false;

  private signalRSub?: Subscription;

  displayedColumns: string[] = ['orderId', 'orderDesc', 'amount', 'createdAt'];

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: any) => {
      this.customerId = +params['customerId'] || 0;
      if (this.customerId)
        this.loadOrders(this.customerId);
      else
        this.loadAllCustOrders();
    });
  }

  loadOrders(id: number): void {
    this.service.getOrders(id).subscribe({
      next: (data: any) => {
        this.orders = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error loading orders', err)
    });
  }
  loadAllCustOrders() {
    this.service.getAllCustOrders().subscribe({
      next: (data: any) => {
        this.orders = data;
        this.cdr.detectChanges();
      },
      error: (err: any) => console.error('Error loading orders', err)
    });
  }
  onToggleAutoUpdate(): void {
    if (this.autoUpdateEnabled) {
      console.log('Auto-update ON');
      this.service.addOrderListener((order: any) => {
        if (order.customerId === this.customerId) {
          this.orders.unshift(order);
        }
      });
    } else {
      console.log('Auto-update OFF');
      this.service.removeOrderListener();
    }
  }
}
