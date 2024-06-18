import { Injectable } from '@angular/core';
import { NavItem } from '../../shared/interfaces/nav-item.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminRoutesService {

  private _dashboard: NavItem = {
    title: 'Dashboard',
    route: '/admin/dashboard'
  };

  private _map: NavItem = {
    title: 'Map',
    route: '/admin/map'
  };

  private _networks: NavItem = {
    title: 'Networks',
    route: '/admin/networks'
  };

  private _users: NavItem = {
    title: 'Users',
    route: '/admin/users'
  };

  private _settings: NavItem = {
    title: 'Settings',
    route: '/admin/settings'
  };

  private _networkDetail: NavItem = {
    title: 'Network Detail',
    route: '/admin/networks/:id'
  };

  constructor() { }

  getDashboard(): NavItem {
    return this._dashboard;
  }

  getMap(): NavItem {
    return this._map;
  }

  getNetworks(): NavItem {
    return this._networks;
  }

  getUsers(): NavItem {
    return this._users;
  }

  getSettings(): NavItem {
    return this._settings;
  }

  getNetworkDetail(): NavItem {
    return this._networkDetail;
  }

  getNavItems(): NavItem[] {
    return [this._dashboard, this._map, this._networks, this._users];
  }

}
