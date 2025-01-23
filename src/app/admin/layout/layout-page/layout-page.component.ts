import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../../shared/interfaces/nav-item.interface';
import { AdminRoutesService } from '../../services/admin-routes.service';
import { withHashLocation } from '@angular/router';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent implements OnInit {

  public navItems: NavItem[] = [];

  constructor(
    private adminRoutesService: AdminRoutesService
  ) {}

  ngOnInit(): void {
    this.navItems = this.adminRoutesService.getNavItems();
  }


}
