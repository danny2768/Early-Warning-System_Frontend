import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminAuthGuard } from './auth/guards/admin-auth.guard';
import { userAuthGuard } from './auth/guards/user-auth.guard';
import { AccessDeniedComponent } from './shared/pages/access-denied/access-denied.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    canActivate: [ adminAuthGuard ]
  },
  {
    path: 'user',
    loadChildren: () => import('./user/user.module').then(m => m.UserModule),
    canActivate: [ userAuthGuard ]
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: '**',
    redirectTo: 'auth',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
