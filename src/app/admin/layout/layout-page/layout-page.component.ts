import { Component } from '@angular/core';
import { NavItem } from '../../../shared/interfaces/nav-item.interface';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent {

  navItems: NavItem[] = [
    {
      title: 'Dashboard',
      route: '/admin/dashboard'
    },
    // TODO: Fix routes
    {
      title: 'Map',
      route: '/auth'
    },
    {
      title: 'Users',
      route: '/auth'
    },
    {
      title: 'Settings',
      route: '/auth'
    },
  ];
}
