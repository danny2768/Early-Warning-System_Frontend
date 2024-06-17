import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { LayoutPageComponent } from './layout/layout-page/layout-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { SharedModule } from '../shared/shared.module';
import { MapComponent } from './components/map/map.component';
import { StationsTableComponent } from './components/stations-table/stations-table.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NetworksPageComponent } from './pages/networks-page/networks-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { SearchNetworkPipe } from './pipes/search-network.pipe';
import { SortByNetworkPipe } from './pipes/sort-by-network.pipe';
import { NetworkFormModalComponent } from './components/network-form-modal/network-form-modal.component';
import { NetworkDetailPageComponent } from './pages/network-detail-page/network-detail-page.component';
import { StationDetailPageComponent } from './pages/station-detail-page/station-detail-page.component';


@NgModule({
  declarations: [
    // Pipes
    SearchNetworkPipe,
    SortByNetworkPipe,

    // Components
    LayoutPageComponent,
    DashboardComponent,
    MapComponent,
    StationsTableComponent,
    MapPageComponent,
    NetworksPageComponent,
    UsersPageComponent,
    NetworkFormModalComponent,
    NetworkDetailPageComponent,
    StationDetailPageComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
  providers: [
    DatePipe,
  ]
})
export class AdminModule { }
