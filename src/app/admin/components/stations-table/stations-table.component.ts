import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Subject, takeUntil } from 'rxjs';
import { Station } from '../../../shared/interfaces/station.interface';
import { AdminRoutesService } from '../../services/admin-routes.service';
import { Pagination } from '../../../shared/interfaces/pagination.interface';

@Component({
  selector: 'admin-stations-table',
  templateUrl: './stations-table.component.html',
  styleUrl: './stations-table.component.css'
})
export class StationsTableComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  public stations: Station[] = [];
  public pagination?: Pagination;
  public limit: 5 | 10 | 15 = 5;

  public mapRoute = '';

  constructor(
    private adminService: AdminService,
    private AdminRoutesService: AdminRoutesService,
  ) {}

  ngOnInit(): void {
    this.getStations(1, this.limit);

    // Get the map route
    this.AdminRoutesService.getNavItems().forEach(item => {
      if (item.title === 'Map') {
        this.mapRoute = item.route;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStations( page: number = 1, limit: number = 4 ): void {
    this.adminService.getStations( page, limit ).pipe( takeUntil(this.destroy$) )
      .subscribe({
        next: (resp) => {
          this.stations = resp.stations;
          this.pagination = resp.pagination;
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  nextPage(): void {
    if (this.pagination && this.pagination.next) {
      this.getStations(this.pagination.page + 1, this.pagination.limit);
    }
  }

  prevPage(): void {
    if (this.pagination && this.pagination.prev) {
      this.getStations(this.pagination.page - 1, this.pagination.limit);
    }
  }

  firstPage(): void {
    this.getStations(1, this.pagination!.limit);
  }

  lastPage(): void {
    if (this.pagination) {
      this.getStations(this.pagination.totalPages, this.pagination.limit);
    }
  }

  changeLimit(newLimit: 5 | 10 | 15 ): void {
    this.limit = newLimit;
    this.getStations( 1, this.limit );

    this.closeDropdown(['limitDropdown'])
  }

  closeDropdown( dropdownIds: string[] ): void {
    dropdownIds.forEach(dropdownId => {
      document.getElementById(dropdownId)?.removeAttribute('open');
    });
  }

}
