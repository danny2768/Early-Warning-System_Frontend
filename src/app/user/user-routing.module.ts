import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './layout/layout-page/layout-page.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { MapPageComponent } from './pages/map-page/map-page.component';

const routes: Routes = [
    {
      path: '',
      component: LayoutPageComponent,
      children: [
        { path: 'profile', component: ProfileComponent },
        { path: 'map', component: MapPageComponent },
        {
          path: '',
          redirectTo: 'profile',
          pathMatch: 'full'
        }
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
