import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './layout/layout-page/layout-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { NetworksPageComponent } from './pages/networks-page/networks-page.component';
import { UsersPageComponent } from './pages/users-page/users-page.component';
import { StationDetailPageComponent } from './pages/station-detail-page/station-detail-page.component';
import { NetworkDetailPageComponent } from './pages/network-detail-page/network-detail-page.component';
import { NotFoundComponent } from '../shared/pages/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    component: LayoutPageComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'map', component: MapPageComponent },
      { path: 'networks', component: NetworksPageComponent },
      { path: 'networks/:id', component: NetworkDetailPageComponent },
      { path: 'station-detail/:id', component: StationDetailPageComponent },
      { path: 'users', component: UsersPageComponent },
      // TODO: create settings page
      { path: 'settings', component: MapPageComponent },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
    ]
  },
  { path: '**', component: NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
