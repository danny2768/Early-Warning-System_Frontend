import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutPageComponent } from './layout/layout-page/layout-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { MapComponent } from './components/map/map.component';
import { StationsTableComponent } from './components/stations-table/stations-table.component';
import { MapPageComponent } from './pages/map-page/map-page.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    DashboardComponent,
    MapComponent,
    StationsTableComponent,
    MapPageComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
  ]
})
export class AdminModule { }
