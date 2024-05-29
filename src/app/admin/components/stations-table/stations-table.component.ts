import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Subject, takeUntil } from 'rxjs';
import { Station } from '../../../shared/interfaces/station.interface';

@Component({
  selector: 'admin-stations-table',
  templateUrl: './stations-table.component.html',
  styleUrl: './stations-table.component.css'
})
export class StationsTableComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  public stations: Station[] = [];


  constructor(
    private adminService: AdminService,
  ) {}


  ngOnInit(): void {
    this.getStations();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getStations() {
    this.adminService.getStations().pipe( takeUntil(this.destroy$) )
      .subscribe({
        next: (resp) => {
          this.stations = resp.stations;
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

}
