import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { TenantsComponent } from '../../pages/tenants/tenants.component';
import { PaymentComponent } from '../../pages/payment/payment.component';
import { UserProfileComponent } from '../../pages/user-profile/user-profile.component';
import { UserGaurdService } from 'src/app/services/user-guard.service';

export const AdminLayoutRoutes: Routes = [
  {
    path: 'properties',
    canActivate: [UserGaurdService],
    data: {
      roles: ['admin'],
    },
    component: DashboardComponent,
  },
  {
    path: 'tenants',
    canActivate: [UserGaurdService],
    data: {
      roles: ['admin'],
    },
    component: TenantsComponent,
  },
  {
    path: 'payments',
    canActivate: [UserGaurdService],
    data: {
      roles: ['admin'],
    },
    component: PaymentComponent,
  },
  {
    path: 'user-profile',
    canActivate: [UserGaurdService],
    data: {
      roles: ['admin', 'user'],
    },
    component: UserProfileComponent,
  },
];
