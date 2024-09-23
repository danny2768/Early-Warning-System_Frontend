import { Component, effect, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from '../../../shared/interfaces/user.interface';
import { AuthService } from '../../../auth/services/auth.service';
import { StationSubscription } from '../../../shared/interfaces/subscription.interface';
import { Subject, takeUntil } from 'rxjs';
import { Station } from '../../../shared/interfaces/station.interface';
import { Pagination } from '../../../shared/interfaces/pagination.interface';
import { StationResponse } from '../../../shared/interfaces/stations-resp.interface';

@Component({
  selector: 'user-subscriptions',
  templateUrl: './user-subscriptions.component.html',
  styleUrl: './user-subscriptions.component.css'
})
export class UserSubscriptionsComponent implements OnInit {
  private destroy$ = new Subject<void>();

  @Input({ required: true})
  public user: WritableSignal<User | undefined> = signal(undefined);

  public userSubscription?: StationSubscription;
  public userSubscriptionEmpty: boolean = false;

  public subscribedStations: Station[] = [];
  public pagination?: Pagination;

  public loadComplete: WritableSignal<boolean> = signal(false);

  public dialogInfo = {
    showDialog: false,
    title: '',
    description: '',
  };

  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {
    effect(() => {
      const user = this.user();
      if (user && !this.userSubscription) {
        this.getUserSubscription(user.id);
      }
    });
  }

  ngOnInit(): void {
    const user = this.getUser();
    if (user) {
      this.getUserSubscription(user.id);
    }

    this.getSubscribedStations();
  }

  public getSubscribedStations( page: number = 1, limit: number = 5 ): void {
    this.userService.getSubscribedStations( page , limit )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (userSubscription: StationResponse) => {
          this.subscribedStations = userSubscription.stations;
          this.pagination = userSubscription.pagination;

          this.loadComplete.set(true);
        },
        error: (err) => {
          // "error": "No subscription found for user 66f11ef596e73ee888427985" (404)
          switch (err.status) {
            case 404:
              const errorMessage: string = err.error.error;
              if (errorMessage.includes('No subscription found')) {
                this.loadComplete.set(true);
              } else {
                this.displayDialog('Error', 'An error occurred while loading the user subscriptions. Please try again later.');
              }
              break;
            case 403:
              this.displayDialog('Error', 'You do not have permission to access this resource');
              break;
            default:
              this.displayDialog('Error', 'An error occurred while loading the user subscriptions. Please try again later.');
              break;
          }
        }
      });
  }

  private getUser(): User | undefined {
    return this.authService.getUser();
  }

  private getUserSubscription( userId: string ): void {
    this.userService.getUserSubscription( userId )
      .subscribe({
        next: (subscription: StationSubscription) => {
          this.userSubscription = subscription;
        },
        error: (err) => {
          switch (err.status) {
            case 404:
              const errorMessage: string = err.error.error;
              if (errorMessage.includes('No subscription found')) {
                this.userSubscriptionEmpty = true;
              } else {
                this.displayDialog('Error', 'An error occurred while loading the user subscription data. Please try again later.');
              }
              break;
            case 403:
              this.displayDialog('Error', 'You do not have permission to access this resource');
              break;
            default:
              this.displayDialog('Error', 'An error occurred while loading the user subscription data. Please try again later.');
              break;
          }
        }
      });
  }

  // # Dialog Methods
  displayDialog(title: string, description: string): void {
    this.dialogInfo = {
      showDialog: true,
      title,
      description,
    };
  }

  closeDialog(): void {
    this.dialogInfo.showDialog = false;
  }

  // # Pagination Methods
  nextPage(): void {
    if (this.pagination && this.pagination.next) {
      this.getSubscribedStations(this.pagination.page + 1, this.pagination.limit);
    }
  }

  prevPage(): void {
    if (this.pagination && this.pagination.prev) {
      this.getSubscribedStations(this.pagination.page - 1, this.pagination.limit);
    }
  }

  firstPage(): void {
    this.getSubscribedStations(1, this.pagination!.limit);
  }

  lastPage(): void {
    if (this.pagination) {
      this.getSubscribedStations(this.pagination.totalPages, this.pagination.limit);
    }
  }

}
