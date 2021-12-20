import { AuthService } from './../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  roles: string[];
}
export const ROUTES: RouteInfo[] = [
  {
    path: '/properties',
    title: 'Properties',
    roles: ['admin'],
    icon: 'ni-tv-2 text-primary',
    class: '',
  },
  {
    path: '/tenants',
    title: 'Tenants',
    icon: 'ni-planet text-blue',
    roles: ['admin'],
    class: '',
  },
  {
    path: '/payments',
    title: 'Payments',
    icon: 'ni-pin-3 text-orange',
    roles: ['admin'],
    class: '',
  },
  {
    path: '/user-profile',
    title: 'Profile',
    icon: 'ni-single-02 text-yellow',
    roles: ['admin', 'user'],
    class: '',
  },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  public menuItems: any[] = [];
  public isCollapsed = true;
  userRole: string | undefined;

  constructor(private router: Router, private authService: AuthService) {
    this.userRole = this.authService.currentUserValue?.role;
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) =>
      menuItem.roles.includes(this.userRole as string)
    );
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
