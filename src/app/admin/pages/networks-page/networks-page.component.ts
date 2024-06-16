import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Network } from '../../../shared/interfaces/network.interface';
import { Pagination } from '../../../shared/interfaces/pagination.interface';

@Component({
  selector: 'app-networks-page',
  templateUrl: './networks-page.component.html',
  styleUrl: './networks-page.component.css'
})
export class NetworksPageComponent implements OnInit {

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

  constructor(
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.loadNetworks();
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

  closeDialog(): void {
    this.dialogInfo.showDialog = false;
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