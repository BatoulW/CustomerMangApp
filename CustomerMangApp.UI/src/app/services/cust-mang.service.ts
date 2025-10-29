import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import * as signalR from '@microsoft/signalr';
import { BehaviorSubject } from 'rxjs';
export interface Customer {
  customerId: number;
  customerName: string;
  email: string;
  isActive: boolean;
  createdAt?: string;
  orders?: Order[];
}
export interface Order {
  orderId?: number;
  orderDesc: string;
  amount: number;
  createdAt: string;
  customerId?: number;
}
@Injectable({
  providedIn: 'root'
})
export class CustMangService {
  private apiUrl = 'https://localhost:7116';

  constructor(private http: HttpClient) { }

  private hubConnection!: signalR.HubConnection;
  private ordersSubject = new BehaviorSubject<any>(null);
  orders$ = this.ordersSubject.asObservable();
  private orderListener?: (...args: any[]) => void;

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(`${this.apiUrl}/hubs/ordersHub`, {
        withCredentials: true,
        skipNegotiation: true,
        transport: signalR.HttpTransportType.WebSockets
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.start().catch((err: any) => console.error(err));
    this.hubConnection.on('OrderCreated', (order: Order) => {
      console.log('Received order:', order);
      this.ordersSubject.next(order)
    });
  }
  addOrderListener(callback: (order: any) => void): void {
    this.orderListener = callback;
    this.hubConnection?.on('ReceiveOrder', callback);
  }

  removeOrderListener(): void {
    if (this.orderListener && this.hubConnection) {
      this.hubConnection.off('ReceiveOrder', this.orderListener);
      this.orderListener = undefined;
    }
  }
  getCustomers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.apiUrl}/customers`);
  }

  getCustomer(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/customers/${id}`);
  }

  addCustomer(customer: Customer): Observable<Customer> {
    return this.http.post<Customer>(`${this.apiUrl}/customers`, customer);
  }

  updateCustomer(id: number, customer: Customer): Observable<Customer> {
    return this.http.put<Customer>(`${this.apiUrl}/customers/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/customers/${id}`);
  }

  getOrders(id: number): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders/${id}`);
  }

  getAllCustOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.apiUrl}/orders`);
  }
}
