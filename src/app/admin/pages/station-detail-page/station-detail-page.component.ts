import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-station-detail-page',
  templateUrl: './station-detail-page.component.html',
  styleUrl: './station-detail-page.component.css'
})
export class StationDetailPageComponent implements OnInit, OnDestroy{

  private destroy$ = new Subject<void>();


  constructor(
    private adminService: AdminService,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.pipe().subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
