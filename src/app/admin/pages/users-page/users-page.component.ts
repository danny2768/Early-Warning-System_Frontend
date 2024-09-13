import { Component } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { User } from '../../../shared/interfaces/user.interface';
import { Pagination } from '../../../shared/interfaces/pagination.interface';
import { AdminService } from '../../services/admin.service';
import { YesNoDialogOptions } from '../../interfaces/yes-no-dialog-options.interface';
import { FormDialogInfo } from '../../interfaces/form-dialog-info.interface';

@Component({
  selector: 'app-users-page',
  templateUrl: './users-page.component.html',
  styleUrl: './users-page.component.css'
})
export class UsersPageComponent {

  private destroy$ = new Subject<void>();

  public loadComplete: boolean = false;
  public users: User[] = [];
  public pagination?: Pagination;
  public limit: 10 | 25 | 50 | 100 = 10;

  public orderby: keyof User = 'id';
  public searchText: string = '';

  public dialogInfo = {
    showDialog: false,
    title: '',
    description: ''
  };

  public yesNoDialogInfo = {
    showDialog: false,
    title: '',
    description: '',
    acceptButtonText: '',
    discardButtonText: '',
    acceptEvent: () => {},
    discardEvent: () => {},
  };

  public formDialogInfo: FormDialogInfo = {
    showdialog: false,
    title: '',
    action: 'create',
  }

  constructor(
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers( page: number = 1, limit: number = 10 ) {
    this.adminService.getUsers( page, limit ).pipe(takeUntil(this.destroy$)).subscribe({
      next: resp => {
        this.users = resp.users;
        this.pagination = resp.pagination;

        this.loadComplete = true;
      },
      error: err => {
        this.displayDialog('Error', 'An error occurred while loading the users. Please try again later.');
      }
    });
  }

  deleteUser( userId: string ): void {
    this.adminService.deleteUser( userId ).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.closeYesNoDialog();
        this.displayDialog('Success', 'User deleted successfully')
        this.loadUsers();
      },
      error: err => {
        this.closeYesNoDialog();
        if ( err.error.error ) {
          this.displayDialog('Error', err.error.error);
        } else {
          this.displayDialog('Error', 'An error occurred while deleting the user. Please try again later.');
        }
      }
    });
  }

  onDeleteUser( userId: string ): void {
    this.displayYesNoDialog({
      title: 'Delete User',
      description: 'Are you sure you want to delete this user?',
      acceptButtonText: 'Yes',
      discardButtonText: 'No',
      acceptEvent: () => this.deleteUser(userId),
      discardEvent: () => this.closeYesNoDialog()
    });
  }

  // # Pagination methods
  changeLimit(newLimit: 10 | 25 | 50 | 100 ): void {
    this.limit = newLimit;
    this.loadUsers( 1, this.limit );

    this.closeDropdown(['limitDropdown'])
  }

  nextPage(): void {
    if (this.pagination && this.pagination.next) {
      this.loadUsers(this.pagination.page + 1, this.limit);
    }
  }

  prevPage(): void {
    if (this.pagination && this.pagination.prev) {
      this.loadUsers(this.pagination.page - 1, this.limit);
    }
  }

  firstPage(): void {
    this.loadUsers(1, this.limit);
  }

  lastPage(): void {
    if (this.pagination) {
      this.loadUsers(this.pagination.totalPages, this.limit);
    }
  }


  // # Modals
  displayDialog( title: string, description: string): void {
    this.dialogInfo = {
      showDialog: true,
      title,
      description
    }
  }

  displayYesNoDialog( options: YesNoDialogOptions ): void {
    this.yesNoDialogInfo = {
      showDialog: true,
      ...options
    }
  }

  displayFormDialog( action: 'create' | 'update', network?: User ): void {
    if (action === 'update') {
      this.formDialogInfo.title = 'Update user';
      this.formDialogInfo.user = network;
    } else {
      this.formDialogInfo.title = 'Create user';
      this.formDialogInfo.user = undefined;
    }

    this.formDialogInfo.action = action;
    this.formDialogInfo.showdialog = true;
  }

  closeYesNoDialog(): void {
    this.yesNoDialogInfo.showDialog = false;
  }

  closeFormDialog(): void {
    this.formDialogInfo.showdialog = false;
    this.loadUsers( this.pagination?.page, this.pagination?.limit );
  }

  closeDialog(): void {
    this.dialogInfo.showDialog = false;
  }

  // # Other methods
  closeDropdown( dropdownIds: string[] ): void {
    dropdownIds.forEach(dropdownId => {
      document.getElementById(dropdownId)?.removeAttribute('open');
    });
  }

  changeOrder( value: keyof User ): void {
    this.orderby = value;

    this.closeDropdown(['filterDropdown'])
  }

  copyToClipboard(id: string): void {
    this.adminService.copyToClipboard(id);
  }
}
