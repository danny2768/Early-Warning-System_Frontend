import { Component, OnDestroy, OnInit, signal, ViewChild, WritableSignal } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { concatMap, forkJoin, map, Subject, takeUntil, tap } from 'rxjs';
import { Station } from '../../../shared/interfaces/station.interface';
import { AdminRoutesService } from '../../services/admin-routes.service';
import { StationInfoComponent } from '../../components/station-info/station-info.component';
import { Sensor, Threshold } from '../../interfaces/sensor.interface';
import { Reading } from '../../interfaces/reading.interface';
import { GetSensorReadingsResp } from '../../interfaces/get-sensor-readings-resp.interface';

export interface SensorWithReadings {
  sensor: Sensor;
  readings?: Reading[];
}

@Component({
  selector: 'app-station-detail-page',
  templateUrl: './station-detail-page.component.html',
  styleUrl: './station-detail-page.component.css'
})
export class StationDetailPageComponent implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>();

  private paramsStationId?: string;
  public station: WritableSignal<Station | undefined> = signal(undefined);
  public sensorsWithReadings: WritableSignal<SensorWithReadings[] | undefined> = signal(undefined);

  public onLoadError = {
    display: false,
    title: 'Oops! Something went wrong.',
    description: 'An error occurred while loading the data. Please try again later.'
  }

  selectedTab: 'Data' | 'Graph' = 'Data';

  @ViewChild(StationInfoComponent)
  stationInfoComponent!: StationInfoComponent;

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
      next: (resp: Station) => {
        this.station.set(resp);
        this.getSensorsByStationId(resp.id);
      },
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

  getSensorsByStationId(stationId: string): void {
    this.adminService.getSensorsByStationId(stationId)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (sensors: Sensor[]) => {
          this.getReadingsForSensors(sensors);
        },
        error: (err) => {
          console.error('Error loading sensors', err);
          this.displayOnLoadError('Oops! Something went wrong.', 'An error occurred while loading the data. Please try again later.');
        }
      });
  }

  getReadingsForSensors(sensors: Sensor[]): void {
    const sensorReadings$ = sensors.map(sensor =>
      this.adminService.getSensorReadings(sensor.id).pipe(
        takeUntil(this.destroy$),
        map((resp: GetSensorReadingsResp) => ({
          sensor,
          readings: resp.readings
        }))
      )
    );

    forkJoin(sensorReadings$).subscribe({
      next: (sensorsWithReadings: SensorWithReadings[]) => {
        this.sensorsWithReadings.set(sensorsWithReadings);
      },
      error: (err) => {
        console.error('Error loading sensor readings', err);
        this.displayOnLoadError('Oops! Something went wrong.', 'An error occurred while loading the data. Please try again later.');
      }
    });
  }

  // # Side sheet
  openSideSheet(): void {
    this.stationInfoComponent.openSideSheet();
  }

  closeSideSheet(): void {
    this.stationInfoComponent.closeSideSheet();
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

  // # tabs
  selectTab(tab: 'Data' | 'Graph') {
    this.selectedTab = tab;
  }

  getChartData(readings?: Reading[]): { value: number, date: string }[] {
    if (!readings) return [];

    return readings.map(reading => ({
      value: reading.value,
      date: reading.createdAt as unknown as string
    }));
  }

  getStatus(reading: Reading, threshold: Threshold, sensorType: string): string {
    if (!reading || !threshold) return 'unknown';

    if (sensorType === 'level') {
      if (reading.value <= threshold.red) {
        return 'danger';
      } else if (reading.value <= threshold.orange) {
        return 'warning';
      } else if (reading.value <= threshold.yellow) {
        return 'caution';
      } else {
        return 'normal';
      }
    } else {
      if (reading.value >= threshold.red) {
        return 'danger';
      } else if (reading.value >= threshold.orange) {
        return 'warning';
      } else if (reading.value >= threshold.yellow) {
        return 'caution';
      } else {
        return 'normal';
      }
    }
  }
}
