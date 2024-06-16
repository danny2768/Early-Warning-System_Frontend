import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Network } from '../../../shared/interfaces/network.interface';
import { Pagination } from '../../../shared/interfaces/pagination.interface';
import { Subject, takeUntil } from 'rxjs';

interface YesNoDialogOptions {
  title: string;
  description: string;
  acceptButtonText: string;
  discardButtonText: string;
  acceptEvent: () => void;
  discardEvent: () => void;
}

interface FormDialogInfo {
  showdialog: boolean;
  title: string;
  action: 'create' | 'update';
  network?: Network;
}

@Component({
  selector: 'app-networks-page',
  templateUrl: './networks-page.component.html',
  styleUrl: './networks-page.component.css'
})
export class NetworksPageComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  public networks: Network[] = [];
  public pagination?: Pagination;
  public limit: 10 | 25 | 50 | 100 = 10;

  public orderby: keyof Network = 'id';
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
    this.loadNetworks();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadNetworks( page: number = 1, limit: number = 10 ) {
    this.adminService.getNetworks( page, limit ).subscribe({
      next: resp => {
        this.networks = resp.networks;
        this.pagination = resp.pagination;
        console.log(this.pagination.totalPages);
      },
      error: err => {
        this.displayDialog('Error', 'An error occurred while loading the networks. Please try again later.');
      }
    });
  }

  onDeleteNetwork( networkId: string ): void {
    this.displayYesNoDialog({
      title: 'Delete network',
      description: 'Are you sure you want to delete this network?',
      acceptButtonText: 'Yes',
      discardButtonText: 'No',
      acceptEvent: () => this.deleteNetwork(networkId),
      discardEvent: () => this.closeYesNoDialog()
    });
  }

  deleteNetwork( networkId: string ): void {
    this.adminService.deleteNetwork( networkId ).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.closeYesNoDialog();
        this.displayDialog('Success', 'Network deleted successfully')
        this.loadNetworks();
      },
      error: err => {
        this.displayDialog('Error', 'An error occurred while deleting the network. Please try again later.');
      }
    });
  }

  // # Pagination methods
  changeLimit(newLimit: 10 | 25 | 50 | 100 ): void {
    this.limit = newLimit;
    this.loadNetworks( 1, this.limit );

    this.closeDropdown(['limitDropdown'])
  }

  nextPage(): void {
    if (this.pagination && this.pagination.next) {
      this.loadNetworks(this.pagination.page + 1);
    }
  }

  prevPage(): void {
    if (this.pagination && this.pagination.prev) {
      this.loadNetworks(this.pagination.page - 1);
    }
  }

  firstPage(): void {
    this.loadNetworks(1);
  }

  lastPage(): void {
    if (this.pagination) {
      this.loadNetworks(this.pagination.totalPages);
    }
  }

  // # Modal dialog methods
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

  displayFormDialog( action: 'create' | 'update', network?: Network ): void {
    if (action === 'update') {
      this.formDialogInfo.title = 'Update network';
      this.formDialogInfo.network = network;
    } else {
      this.formDialogInfo.title = 'Create network';
      this.formDialogInfo.network = undefined;
    }

    this.formDialogInfo.action = action;
    this.formDialogInfo.showdialog = true;
  }

  closeDialog(): void {
    this.dialogInfo.showDialog = false;
  }

  closeYesNoDialog(): void {
    this.yesNoDialogInfo.showDialog = false;
  }

  closeFormDialog(): void {
    this.formDialogInfo.showdialog = false;
    this.loadNetworks( this.pagination?.page, this.pagination?.limit );
  }

  // # Other methods
  closeDropdown( dropdownIds: string[] ): void {
    dropdownIds.forEach(dropdownId => {
      document.getElementById(dropdownId)?.removeAttribute('open');
    });
  }

  changeOrder( value: keyof Network ): void {
    this.orderby = value;

    this.closeDropdown(['filterDropdown'])
  }

}
