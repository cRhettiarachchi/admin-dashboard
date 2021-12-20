import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { AuthGuardService } from './services/auth-guard.service';
import { LoginActiveService } from './services/login-active.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'properties',
    pathMatch: 'full',
  },
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [AuthGuardService],
    data: {
      roles: ['admin', 'user'],
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/layouts/admin-layout/admin-layout.module').then(
            (m) => m.AdminLayoutModule
          ),
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [LoginActiveService],
    children: [
      {
        path: '',
        loadChildren: () =>
          import('src/app/layouts/auth-layout/auth-layout.module').then(
            (m) => m.AuthLayoutModule
          ),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'properties',
  },
];

@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes, {
      useHash: true,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
