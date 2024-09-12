import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { concat, concatMap, Subject, takeUntil, tap } from 'rxjs';
import { Station } from '../../../shared/interfaces/station.interface';
import { AdminRoutesService } from '../../services/admin-routes.service';

@Component({
  selector: 'app-station-detail-page',
  templateUrl: './station-detail-page.component.html',
  styleUrl: './station-detail-page.component.css'
})
export class StationDetailPageComponent implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>();

  private paramsStationId?: string;
  public station?: Station;

  public onLoadError = {
    display: false,
    title: 'Oops! Something went wrong.',
    description: 'An error occurred while loading the data. Please try again later.'
  }

  constructor(
    private adminService: AdminService,
    private adminRoutesService: AdminRoutesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe(
      tap(({ id }) => this.paramsStationId = id),
      takeUntil(this.destroy$),
      concatMap(({ id }) => this.adminService.getStationById(id))
    ).subscribe({
      next: (resp: Station) => this.station = resp,
      error: (err) => {
        switch (err.status) {
          case 400:
            const errorMessage: string = err.error.error;
            if (errorMessage.includes(`No station with id ${this.paramsStationId} has been found`)) {
              this.displayOnLoadError('Station not found', 'The station you are trying to access does not exist.');
            } else {
              this.displayOnLoadError('Oops! Something went wrong.', 'An error occurred while loading the data. Please try again later.');
            }
            break;
          default:
            this.displayOnLoadError('Oops! Something went wrong.', 'An error occurred while loading the data. Please try again later.');
            break;
        }
        console.error('Error loading data', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }



  // # Modals

  displayOnLoadError( title: string, description: string ): void {
    this.onLoadError.title = title;
    this.onLoadError.description = description;
    this.onLoadError.display = true;
  }

  // # Navigation
  getNetworkMainPageRoute(): string {
    return this.adminRoutesService.getNetworks().route;
  }
}
