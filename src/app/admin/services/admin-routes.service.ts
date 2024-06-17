import { Injectable } from '@angular/core';
import { NavItem } from '../../shared/interfaces/nav-item.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminRoutesService {

  private _navItems: NavItem[] = [
    {
      title: 'Dashboard',
      route: '/admin/dashboard'
    },
    {
      title: 'Map',
      route: '/admin/map'
    },
    {
      title: 'Networks',
      route: '/admin/networks'
    },
    {
      title: 'Users',
      route: '/admin/users'
    },
    {
      title: 'Settings',
      route: '/admin/settings'
    },
  ];

  constructor() { }

  getNavItems(): NavItem[] {
    return this._navItems;
  }
}
