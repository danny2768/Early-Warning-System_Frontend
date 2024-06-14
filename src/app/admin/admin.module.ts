import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutPageComponent } from './layout/layout-page/layout-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { MapComponent } from './components/map/map.component';
import { StationsTableComponent } from './components/stations-table/stations-table.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworksPageComponent } from './pages/networks-page/networks-page.component';
import { StationsPageComponent } from './pages/stations-page/stations-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';


@NgModule({
  declarations: [
    LayoutPageComponent,
    DashboardComponent,
    MapComponent,
    StationsTableComponent,
    MapPageComponent,
    NetworksPageComponent,
    StationsPageComponent,
    UsersPageComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ]
})
export class AdminModule { }
