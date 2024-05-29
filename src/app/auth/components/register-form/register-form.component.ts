import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { User } from '../../../shared/interfaces/user.interface';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnDestroy{

  public registerForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirmPassword: ['', [Validators.required, Validators.minLength(8)]]
  }, {validator: this.validatorCheckPasswords});

  public dialogInfo = {
    showDialog: false,
    title: '',
    description: ''
  }

  private subscription?: Subscription;

  private timeoutId?: number;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnDestroy(): void {
    if ( this.subscription ) this.subscription.unsubscribe();
  }

  onSubmit(): boolean {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      console.warn('There are invalid fields');
      if (this.displayDoublePassError()) {
        this.displayDialog('Error - Invalid Form', this.displayDoublePassError()! + '. Please try again.');
      }
      return false;
    }

    const user = this.registerForm.value as User;

    this.subscription = this.authService.register(user)
      .subscribe((resp) => {
        if ( resp instanceof HttpErrorResponse ) {
          this.displayDialog('Error', resp.error.error + '. Please try again.');
          return false;
        }

        if ( typeof resp === 'boolean' && resp) {
          this.displayDialog('Success', 'The user was successfully registered.');

          this.timeoutId = window.setTimeout(() => {
            this.closeDialog();
            this.router.navigate(['./auth/login']);
          }, 3000);
          return true;
        }

        return false;
      })

    return false;
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
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
      this.router.navigate(['./auth/login']);
    }
  }

  // # Field validation

  validatorCheckPasswords(group: FormGroup) {
    let pass = group.controls['password'].value;
    let confirmPass = group.controls['confirmPassword'].value;

    return pass === confirmPass ? null : { notSame: true }
  }

  isFieldInvalid(field: string): boolean | null {
    return (
      this.registerForm.controls[field].errors &&
      this.registerForm.controls[field].touched
    );
  }

  getFieldError(field: string): string | null {
    if (!this.registerForm.controls[field]) return null;

    const errors = this.registerForm.controls[field].errors || {};

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

  displayDoublePassError(): string | null {
    const formErrors = this.registerForm.errors || {};

    for  (const key of Object.keys(formErrors)) {
      if (key === 'notSame') {
        return `Passwords do not match`;
      }
    }
    return null;
  }
}
