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
import { SortByStationPipe } from './pipes/sort-by-station.pipe';
import { SearchStationPipe } from './pipes/search-station.pipe';
import { StationFormModalComponent } from './components/station-form-modal/station-form-modal.component';
import { TruncateIdPipe } from './pipes/truncate-id.pipe';
import { SortByUserPipe } from './pipes/sort-by-user.pipe';
import { SearchUserPipe } from './pipes/search-user.pipe';


@NgModule({
  declarations: [
    // Pipes
    SearchNetworkPipe,
    SortByNetworkPipe,
    SortByStationPipe,
    SearchStationPipe,

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
    StationFormModalComponent,
    TruncateIdPipe,
    SortByUserPipe,
    SearchUserPipe,
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
