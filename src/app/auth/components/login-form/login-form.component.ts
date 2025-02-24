import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Role, User } from '../../../shared/interfaces/user.interface';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginRequest } from '../../interfaces/login-req.interface';

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {

  public loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  public dialogInfo = {
    showDialog: false,
    title: '',
    description: ''
  }

  private subscription?: Subscription;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  onSubmit(): boolean {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      console.warn('There are invalid fields');
      return false;
    }

    const user = this.loginForm.value as User;

    this.subscription = this.authService.loginUser( user )
      .subscribe({
        next: (resp: LoginRequest) => {
          if ( resp.user.role.includes(Role.ADMIN) || resp.user.role.includes(Role.SUPER_ADMIN)) {
            this.router.navigate(['/admin']);
            return true;
          }

          if (resp.user.role.includes(Role.USER)) {
            this.router.navigate(['/user'])
            return true;
          }

          else {
            this.displayDialog('Error', 'Something went wrong. Please try again later or contact an admin.');
            return false;
          }
        },
        error: (err: HttpErrorResponse) => {
          switch (err.status) {
            case 401:
              this.displayDialog('Error', 'Invalid email or password');
              break;
            case 500:
              this.displayDialog('Error', 'Something went wrong. Please try again later or contact an admin.');
              break;
            default:
              this.displayDialog('Error', 'Something went wrong. Please try again later or contact an admin.');
              break;
          }
          console.error('Error logging in', err);
        }
      })


    return true;
  }



  displayDialog( title: string, description: string): void {
    this.dialogInfo = {
      showDialog: true,
      title,
      description
    }
  }

  closeDialog(): void {
    this.dialogInfo.showDialog = false;
  }

  // # Field validation
  isFieldInvalid(field: string): boolean | null {
    return (
      this.loginForm.controls[field].errors &&
      this.loginForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.loginForm.controls[field]) return null;

    const errors = this.loginForm.controls[field].errors || {};

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `This field is required`;
        case 'email':
          return `This field must be a valid email`;
        case 'minlength':
          return `This field must be at least ${errors[key].requiredLength} characters long`;
      }
    }
    return null;
  }
}
