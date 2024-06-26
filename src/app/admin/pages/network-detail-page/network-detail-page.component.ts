import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, forkJoin, map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AdminRoutesService } from '../../services/admin-routes.service';
import { Network } from '../../../shared/interfaces/network.interface';
import { Pagination } from '../../../shared/interfaces/pagination.interface';
import { Station } from '../../../shared/interfaces/station.interface';
import { FormDialogInfo } from '../../interfaces/form-dialog-info.interface';
import { YesNoDialogOptions } from '../../interfaces/yes-no-dialog-options.interface';

@Component({
  selector: 'app-network-detail-page',
  templateUrl: './network-detail-page.component.html',
  styleUrl: './network-detail-page.component.css'
})
export class NetworkDetailPageComponent implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>();
  private paramsNetworkId: string = '';

  public loadComplete: boolean = false;
  public network?: Network;
  public stations: Station[] = [];
  public pagination?: Pagination;
  public limit: 10 | 25 | 50 | 100 = 10;

  public orderby: keyof Station = 'id';
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

  public onLoadError = {
    display: false,
    title: 'Oops! Something went wrong.',
    description: 'An error occurred while loading the data. Please try again later.'
  }

  constructor(
    private adminService: AdminService,
    private adminRoutesService: AdminRoutesService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      tap(({ id }) => this.paramsNetworkId = id),
      takeUntil(this.destroy$),
      concatMap(({ id }) => this.fetchNetworkAndStations())
    ).subscribe({
      next: ({ network, stations }) => {
        this.network = network;
        this.stations = stations.stations;
        this.pagination = stations.pagination;

        this.loadComplete = true;
      },
      error: err => {
        switch (err.status) {
          case 400:
            const errorMessage: string = err.error.error;
            if (errorMessage.includes(`No network with id ${this.paramsNetworkId} has been found`)) {
              this.displayOnLoadError('Network not found', 'The network you are trying to access does not exist.');
            } else {
              this.displayOnLoadError('Oops! Something went wrong.', 'An error occurred while loading the data. Please try again later.');
            }
            break;
          default:
            this.displayOnLoadError('Oops! Something went wrong.', 'An error occurred while loading the data. Please try again later.');
            break;
        }
        console.error('Error loading data', err);
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchNetworkAndStations() {
    return this.adminService.getNetworkById(this.paramsNetworkId).pipe(
      concatMap(network => this.fetchStations(network))
    );
  }

  fetchStations(network: Network) {
    const [ page, limit ] = [ 1, 10 ];
    return this.adminService.getStationsByNetworkId(this.paramsNetworkId, page, limit).pipe(
      map(stations => ({ network, stations }))
    );
  }

  loadStations( page: number = 1, limit: number = 10 ) {
    this.adminService.getStationsByNetworkId( this.paramsNetworkId, page, limit ).pipe(takeUntil(this.destroy$)).subscribe({
      next: resp => {
        this.stations = resp.stations;
        this.pagination = resp.pagination;
      },
      error: err => {
        this.displayOnLoadError('Error', 'An error occurred while loading the stations. Please try again later.');
        console.error(err);
      }
    });
  }

  onDeleteStation( stationId: string ): void {
    this.displayYesNoDialog({
      title: 'Delete station',
      description: 'Are you sure you want to delete this station?',
      acceptButtonText: 'Yes',
      discardButtonText: 'No',
      acceptEvent: () => this.deleteStation(stationId),
      discardEvent: () => this.closeYesNoDialog()
    });
  }

  deleteStation( stationId: string ): void {
    this.adminService.deleteStation( stationId ).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.closeYesNoDialog();
        this.displayDialog('Success', 'Station deleted successfully')
        this.loadStations( this.pagination?.page, this.pagination?.limit );
      },
      error: err => {
        this.closeYesNoDialog();
        if ( err.error.error ) {
          this.displayDialog('Error', err.error.error);
        } else {
          this.displayDialog('Error', 'An error occurred while deleting the station. Please try again later.');
        }
      }
    });
  }

  // # Pagination methods
  changeLimit(newLimit: 10 | 25 | 50 | 100 ): void {
    this.limit = newLimit;
    this.loadStations( 1, this.limit );

    this.closeDropdown(['limitDropdown'])
  }

  nextPage(): void {
    if (this.pagination && this.pagination.next) {
      this.loadStations(this.pagination.page + 1, this.limit);
    }
  }

  prevPage(): void {
    if (this.pagination && this.pagination.prev) {
      this.loadStations(this.pagination.page - 1, this.limit);
    }
  }

  firstPage(): void {
    this.loadStations(1, this.limit);
  }

  lastPage(): void {
    if (this.pagination) {
      this.loadStations(this.pagination.totalPages, this.limit);
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

  displayFormDialog( action: 'create' | 'update', station?: Station ): void {
    if (action === 'update') {
      this.formDialogInfo.title = 'Update station';
      this.formDialogInfo.station = station;
    } else {
      this.formDialogInfo.title = 'Create station';
      this.formDialogInfo.station = undefined;
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
    this.loadStations( this.pagination?.page, this.pagination?.limit );
  }

  // # Other methods
  closeDropdown( dropdownIds: string[] ): void {
    dropdownIds.forEach(dropdownId => {
      document.getElementById(dropdownId)?.removeAttribute('open');
    });
  }

  getNetworkMainPageRoute(): string {
    return this.adminRoutesService.getNetworks().route;
  }

  displayOnLoadError( title: string, description: string ): void {
    this.onLoadError.title = title;
    this.onLoadError.description = description;
    this.onLoadError.display = true;
  }

  changeOrder( value: keyof Station ): void {
    this.orderby = value;

    this.closeDropdown(['filterDropdown'])
  }
}
