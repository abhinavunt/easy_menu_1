import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule  } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CustomerLoginComponent } from './customer-login/customer-login.component';
import { MenuComponent } from './menu/menu.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { AdminLoginComponent } from './admin-login/admin-login.component';
import { FormsModule } from '@angular/forms';
import { AdminPortalComponent } from './admin-portal/admin-portal.component';
import { AdminOrdersComponent } from './admin-orders/admin-orders.component';
import { AdminMenuComponent } from './admin-menu/admin-menu.component';
import { AlertModalComponent } from './modals/alert-modal/alert-modal.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminReportComponent } from './admin-report/admin-report.component';
import { AdminSummaryComponent } from './admin-summary/admin-summary.component';

@NgModule({
  declarations: [
    AppComponent,
    CustomerLoginComponent,
    MenuComponent,
    OrderSummaryComponent,
    AdminLoginComponent,
    AdminPortalComponent,
    AdminOrdersComponent,
    AdminMenuComponent,
    AlertModalComponent,
    AdminReportComponent,
    AdminSummaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgbModule
  ],
  // entryComponents: [
  //   AlertModalComponent
  // ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
