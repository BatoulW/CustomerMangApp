import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';
import { OrderList } from './components/order-list/order-list';
import { CustManag } from './components/cust-manag/cust-manag';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'order-list', component: OrderList },
  { path: 'cust-manag', component: CustManag },
];
