import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'user-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  private destroy$ = new Subject<void>();

  public user: WritableSignal<User | undefined> = signal(undefined);

  public tabSelector: WritableSignal<'profile' | 'subscriptions'> = signal('profile');

  public dialogInfo = {
    showDialog: false,
    title: '',
    description: ''
  };

  constructor(
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.getAndSetUser();
  }

  private getAndSetUser(): void {
    this.authService.getSelfUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user.set(user);
        },
        error: (err) => {
          this.displayDialog('Error', 'An error occurred while loading the user data. Please try again later.');
        }
      });
  }

  public onSetTab(tab: 'profile' | 'subscriptions'): void {
    this.tabSelector.set(tab);
  }

  // # Dialog Methods
  displayDialog( title: string, description: string): void {
    this.dialogInfo = {
      showDialog: true,
      title,
      description
    }
  }

  closeDialog(): void {
    this.dialogInfo.showDialog = false;
  }
}
