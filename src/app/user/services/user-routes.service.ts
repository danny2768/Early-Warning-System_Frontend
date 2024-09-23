import { Injectable } from '@angular/core';
import { NavItem } from '../../shared/interfaces/nav-item.interface';

@Injectable({
  providedIn: 'root'
})
export class UserRoutesService {

  private _profile: NavItem = {
    title: 'Profile',
    route: '/user/profile'
  };

  private _map: NavItem = {
    title: 'Map',
    route: '/user/map'
  };

  constructor() { }

  getProfile(): NavItem {
    return this._profile;
  }

  getMap(): NavItem {
    return this._map;
  }

  getNavItems(): NavItem[] {
    return [this._profile, this._map];
  }
}

