import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../../../auth/services/auth.service';
import { User } from '../../../shared/interfaces/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'user-menu',
  templateUrl: './user-menu.component.html',
  styleUrl: './user-menu.component.css'
})
export class UserMenuComponent {
  @Input({ required: true })
  public user?: User;

  @Output()
  public tab = new EventEmitter<'profile' | 'subscriptions'>();

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  public onSetTab(tab: 'profile' | 'subscriptions'): void {
    this.tab.emit(tab);
  }
}
