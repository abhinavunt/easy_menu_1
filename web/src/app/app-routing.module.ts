import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { MenuComponent } from './menu/menu.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';

const routes: Routes = [
  { path: '', component: CustomerLoginComponent },
  { path: 'menu', component: MenuComponent },
  { path: 'summary', component: OrderSummaryComponent },
  { path: 'adminLogin', component: AdminLoginComponent },
  { path: 'adminPortal', component: AdminPortalComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
