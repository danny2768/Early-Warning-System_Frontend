import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { LayoutPageComponent } from './layout/layout-page/layout-page.component';
import { SharedModule } from '../shared/shared.module';
import { ProfileComponent } from './pages/profile/profile.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { MapComponent } from './components/map/map.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserMenuComponent } from './components/user-menu/user-menu.component';
import { UserAccountComponent } from './components/user-account/user-account.component';
import { UserSubscriptionsComponent } from './components/user-subscriptions/user-subscriptions.component';
import { RolePipe } from '../shared/pipes/role-pipe.pipe';


@NgModule({
  declarations: [
    LayoutPageComponent,
    ProfileComponent,
    MapPageComponent,
    MapComponent,
    UserMenuComponent,
    UserAccountComponent,
    UserSubscriptionsComponent,
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class UserModule { }
