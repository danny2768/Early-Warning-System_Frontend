import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { ModalDialogComponent } from './components/modal-dialog/modal-dialog.component';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';



@NgModule({
  declarations: [
    NavBarComponent,
    ModalDialogComponent,
    AccessDeniedComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    NavBarComponent,
    ModalDialogComponent,
    AccessDeniedComponent,
  ]
})
export class SharedModule { }
