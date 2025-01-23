import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { RouterModule } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { RolePipe } from './pipes/role-pipe.pipe';



@NgModule({
  declarations: [
    NavBarComponent,
    ModalDialogComponent,
    AccessDeniedComponent,
    NotFoundComponent,
    RolePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
  ],
  exports: [
    NavBarComponent,
    ModalDialogComponent,
    AccessDeniedComponent,
    RolePipe,
  ]
})
export class SharedModule { }
