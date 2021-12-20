import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// import { ClipboardModule } from 'ngx-clipboard';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TenantsComponent } from '../../pages/tenants/tenants.component';
import { PaymentComponent } from '../../pages/payment/payment.component';
import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { PaginationModule } from '../../pagination/pagination.module';
import { ComponentsModule } from '../../components/components.module';
import { CreateComponent } from '../../pages/tenants/create/create.component';
import { CreatePropertyComponent } from '../../pages/dashboard/create-property/create-property.component';
import { CreatePaymentComponent } from '../../pages/tenants/create-payment/create-payment.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    SweetAlert2Module.forRoot(),
    PaginationModule,
    ComponentsModule,
  ],
  declarations: [
    DashboardComponent,
    TenantsComponent,
    PaymentComponent,
    UserProfileComponent,
    ClickOutsideDirective,
    CreateComponent,
    CreatePropertyComponent,
    CreatePaymentComponent,
  ],
})
export class AdminLayoutModule {}
