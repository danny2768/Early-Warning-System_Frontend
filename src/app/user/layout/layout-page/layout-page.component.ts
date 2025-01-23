import { Component, OnInit } from '@angular/core';
import { NavItem } from '../../../shared/interfaces/nav-item.interface';
import { UserRoutesService } from '../../services/user-routes.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-layout-page',
  templateUrl: './layout-page.component.html',
  styleUrl: './layout-page.component.css'
})
export class LayoutPageComponent implements OnInit {

  public navItems: NavItem[] = [];

  constructor(
    private userRoutesService: UserRoutesService,
  ) {}

  ngOnInit(): void {
    this.navItems = this.userRoutesService.getNavItems();
  }


}
