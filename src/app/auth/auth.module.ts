import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LayoutPageComponent } from './layout/layout-page/layout-page.component';
import { RegisterFormComponent } from './components/register-form/register-form.component';
import { LoginFormComponent } from './components/login-form/login-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from "../shared/shared.module";


@NgModule({
    declarations: [
        LayoutPageComponent,
        RegisterFormComponent,
        LoginFormComponent
    ],
    imports: [
        CommonModule,
        AuthRoutingModule,
        ReactiveFormsModule,
        SharedModule,
    ]
})
export class AuthModule { }
