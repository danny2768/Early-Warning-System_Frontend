import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { Subject, takeUntil } from 'rxjs';
import { Network } from '../../../shared/interfaces/network.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit, OnDestroy{

  public totalNetworks: number = 0;
  public totalStations: number = 0;
  public totalUsers: number = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.getNetworks();
    this.getStations();
    this.getUsers();
  }

  private getNetworks(): void {
    this.adminService.getNetworks().pipe( takeUntil(this.destroy$) )
    .subscribe({
      next: (resp) => {
        this.totalNetworks = resp.pagination.totalItems;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  private getStations(): void {
    this.adminService.getStations().pipe( takeUntil(this.destroy$) )
      .subscribe({
        next: (resp) => {
          this.totalStations = resp.pagination.totalItems;
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  private getUsers(): void {
    this.adminService.getUsers().pipe( takeUntil(this.destroy$) )
      .subscribe({
        next: (resp) => {
          this.totalUsers = resp.pagination.totalItems;
        },
        error: (err) => {
          console.log(err);
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
